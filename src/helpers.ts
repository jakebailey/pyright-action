import * as cp from "node:child_process";
import * as fs from "node:fs";
import * as path from "node:path";

import * as core from "@actions/core";
import * as httpClient from "@actions/http-client";
import * as tc from "@actions/tool-cache";
import SemVer from "semver/classes/semver";
import { parse } from "shell-quote";

import { version as actionVersion } from "../package.json";
import { type NpmRegistryResponse, parseNpmRegistryResponse } from "./schema";

export function getActionVersion() {
    return actionVersion;
}

export interface NodeInfo {
    version: string;
    execPath: string;
}

export function getNodeInfo(process: NodeInfo): NodeInfo {
    let version = process.version;
    let execPath = process.execPath;
    if (/[/\\]externals[/\\]node16[/\\]/.test(execPath)) {
        // This action currently uses node16, but attempt to use node20
        // if the runner has it in the typical location as it should be faster.
        const node20 = execPath.replace("node16", "node20");
        if (fs.existsSync(node20)) {
            execPath = node20;
            version = cp.execFileSync(node20, ["--version"], { encoding: "utf8" }).trim();
        }
    }

    return {
        version,
        execPath,
    };
}

export interface Args {
    workingDirectory: string;
    noComments: boolean;
    pyrightVersion: string;
    args: readonly string[];
}

// https://github.com/microsoft/pyright/blob/c8a16aa148afea403d985a80bd87998b06135c93/packages/pyright-internal/src/pyright.ts#LL188C35-L188C84
// But also with --verifytypes, which supports JSON but this action doesn't do anything with it.
const flagsWithoutCommentingSupport = new Set([
    "--verifytypes",
    "--stats",
    "--verbose",
    "--createstub",
    "--dependencies",
]);

// TODO: allow non-dashed forms to be passed as inputs. A long time ago, I
// went with dashed names as pyright was not fully consistent, and dashes were
// consistent with other GitHub actions. However, pyright has now gone the
// other way and settled on no dashes in flag names. So, it's probably clearer
// if this action supports the names without dashes.

export async function getArgs() {
    const pyrightInfo = await getPyrightInfo();
    const pyrightPath = await downloadPyright(pyrightInfo);

    const pyrightVersion = new SemVer(pyrightInfo.version);
    // https://github.com/microsoft/pyright/commit/ba18f421d1b57c433156cbc6934e0893abc130db
    const useDashedFlags = pyrightVersion.compare("1.1.309") === -1;

    const args = [path.join(pyrightPath, "package", "index.js")];

    // pyright-action options
    const workingDirectory = core.getInput("working-directory");

    // pyright flags
    const createStub = core.getInput("create-stub");
    if (createStub) {
        args.push("--createstub", createStub);
    }

    const dependencies = core.getInput("dependencies");
    if (dependencies) {
        args.push("--dependencies", dependencies);
    }

    const ignoreExternal = core.getInput("ignore-external");
    if (ignoreExternal) {
        args.push("--ignoreexternal");
    }

    const level = core.getInput("level");
    if (level) {
        args.push("--level", level);
    }

    const project = core.getInput("project");
    if (project) {
        args.push("--project", project);
    }

    const pythonPlatform = core.getInput("python-platform");
    if (pythonPlatform) {
        args.push("--pythonplatform", pythonPlatform);
    }

    const pythonPath = core.getInput("python-path");
    if (pythonPath) {
        args.push("--pythonpath", pythonPath);
    }

    const pythonVersion = core.getInput("python-version");
    if (pythonVersion) {
        args.push("--pythonversion", pythonVersion);
    }

    const skipUnannotated = core.getInput("skip-unannotated");
    if (skipUnannotated) {
        args.push("--skipunannotated", skipUnannotated);
    }

    const stats = getBooleanInput("stats", false);
    if (stats) {
        args.push("--stats");
    }

    const typeshedPath = core.getInput("typeshed-path");
    if (typeshedPath) {
        args.push(useDashedFlags ? "--typeshed-path" : "--typeshedpath", typeshedPath);
    }

    const venvPath = core.getInput("venv-path");
    if (venvPath) {
        args.push(useDashedFlags ? "--venv-path" : "--venvpath", venvPath);
    }

    const verbose = getBooleanInput("verbose", false);
    if (verbose) {
        args.push("--lib");
    }

    const verifyTypes = core.getInput("verify-types");
    if (verifyTypes) {
        args.push("--verifytypes", verifyTypes);
    }

    const warnings = getBooleanInput("warnings", false);
    if (warnings) {
        args.push("--warnings");
    }

    // Deprecated flags
    const lib = getBooleanInput("lib", false);
    if (lib) {
        args.push("--lib");
    }

    const extraArgs = core.getInput("extra-args");
    if (extraArgs) {
        for (const arg of parse(extraArgs)) {
            if (typeof arg !== "string") {
                // eslint-disable-next-line unicorn/prefer-type-error
                throw new Error(`malformed extra-args: ${extraArgs}`);
            }
            args.push(arg);
        }
    }

    const noComments = getBooleanInput("no-comments", false)
        || args.some((arg) => flagsWithoutCommentingSupport.has(arg));

    return {
        workingDirectory,
        noComments,
        pyrightVersion: pyrightInfo.version,
        args,
    };
}

function getBooleanInput(name: string, defaultValue: boolean): boolean {
    const input = core.getInput(name);
    if (!input) {
        return defaultValue;
    }
    return input.toUpperCase() === "TRUE";
}

const pyrightToolName = "pyright";

async function downloadPyright(info: NpmRegistryResponse): Promise<string> {
    // Note: this only works because the pyright package doesn't have any
    // dependencies. If this ever changes, we'll have to actually install it.
    // eslint-disable-next-line unicorn/no-array-callback-reference, unicorn/no-array-method-this-argument
    const found = tc.find(pyrightToolName, info.version);
    if (found) {
        return found;
    }

    const tarballPath = await tc.downloadTool(info.dist.tarball);
    const extractedPath = await tc.extractTar(tarballPath);
    return await tc.cacheDir(extractedPath, pyrightToolName, info.version);
}

async function getPyrightInfo(): Promise<NpmRegistryResponse> {
    const version = await getPyrightVersion();
    const client = new httpClient.HttpClient();
    const resp = await client.get(`https://registry.npmjs.org/pyright/${version}`);
    const body = await resp.readBody();
    if (resp.message.statusCode !== httpClient.HttpCodes.OK) {
        throw new Error(body);
    }
    return parseNpmRegistryResponse(JSON.parse(body));
}

async function getPyrightVersion() {
    const versionSpec = core.getInput("version");
    if (versionSpec) {
        if (versionSpec === "pylance-stable" || versionSpec === "pylance-prerelease") {
            return await getPylancePyrightVersion(versionSpec);
        }

        return new SemVer(versionSpec).format();
    }
    return "latest";
}

interface PylanceBuild {
    pylance: string;
    pyright: string;
}

interface PylanceBuildMap {
    versions: PylanceBuild[];
}

async function getPylancePyrightVersion(versionSpec: "pylance-stable" | "pylance-prerelease") {
    const client = new httpClient.HttpClient();
    const resp = await client.get(
        "https://raw.githubusercontent.com/debonte/pylance-release/main/pyrightVersions.json",
    );
    const versionJson = await resp.readBody();

    if (resp.message.statusCode !== httpClient.HttpCodes.OK) {
        throw new Error("Failed to download Pylance version map");
    }

    const jsonObject = JSON.parse(versionJson) as PylanceBuildMap;
    for (const build of jsonObject.versions) {
        if (
            (versionSpec === "pylance-prerelease" && isPylancePrereleaseVersion(build.pylance))
            || (versionSpec === "pylance-stable" && isPylanceStableVersion(build.pylance))
        ) {
            return build.pyright;
        }
    }

    throw new Error("Unknown Pylance version");

    // if (versionSpec === "pylance-stable") {
    //     return getPyrightVersionForPylanceStable(pylanceChangelog);
    // } else if (versionSpec === "pylance-prerelease") {
    //     return getPyrightVersionForPylancePrerelease(pylanceChangelog);
    // }
}

function isPylancePrereleaseVersion(versionSpec: string) {
    return !isPylanceStableVersion(versionSpec);
}

function isPylanceStableVersion(versionSpec: string) {
    return versionSpec.endsWith("0");
}

// async function getPylancePyrightVersion(versionSpec: "pylance-stable" | "pylance-prerelease") {
//     const client = new httpClient.HttpClient();
//     const resp = await client.get("https://raw.githubusercontent.com/microsoft/pylance-release/main/CHANGELOG.md");
//     const pylanceChangelog = await resp.readBody();

//     if (resp.message.statusCode !== httpClient.HttpCodes.OK) {
//         throw new Error("Failed to download Pylance changelog");
//     }

//     if (versionSpec === "pylance-stable") {
//         return getPyrightVersionForPylanceStable(pylanceChangelog);
//     } else if (versionSpec === "pylance-prerelease") {
//         return getPyrightVersionForPylancePrerelease(pylanceChangelog);
//     }
// }

// function getPyrightVersionForPylancePrerelease(changelog: string, version?: string): string{
//     const prereleaseRegex = /##.*PreRelease[\w\W]*?Pylance's copy of Pyright has been updated from \d+\.\d+\.\d+ to (\d+\.\d+\.\d+)/m;

//     const match = changelog.match(prereleaseRegex);
//     if (!match) {
//         throw new Error(`Could not find pyright version for pylance prerelease version {version}`);
//     }

//     return match[0];
// }

// function getPyrightVersionForPylanceStable(changelog: string, version?: string): string {
//     const stableRegex = /##.* Release[\w\W]*?Release version that includes changes through the \[(\d+\.\d+\.\d+)/m;

//     const match = changelog.match(stableRegex);
//     if (!match) {
//         throw new Error(`Could not find pyright version for pylance stable version {version}`);
//     }

//     return getPyrightVersionForPylancePrerelease(match[0]);
// }

// Scenarios to support:
// Normal prerelease (easy)
// Normal stable -- need to find prerelease it is based on and get its pyright version
// Prerelease hotfix without pyright update -- need to find next oldest prerelease
// Stable hotfix -- need to find next oldest stable and start there
