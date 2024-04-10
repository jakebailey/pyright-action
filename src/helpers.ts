import * as cp from "node:child_process";
import * as path from "node:path";

import * as core from "@actions/core";
import * as httpClient from "@actions/http-client";
import * as tc from "@actions/tool-cache";
import SemVer from "semver/classes/semver";
import { parse } from "shell-quote";
import which from "which";

import { version as actionVersion } from "../package.json";
import { parseNpmRegistryResponse, parsePylanceBuildMetadata } from "./schema";

export function getActionVersion() {
    return actionVersion;
}

export interface NodeInfo {
    version: string;
    execPath: string;
}

export function getNodeInfo(process: NodeInfo): NodeInfo {
    return {
        version: process.version,
        execPath: process.execPath,
    };
}

export interface Args {
    workingDirectory: string;
    annotate: ReadonlySet<"error" | "warning">;
    pyrightVersion: string;
    command: string;
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

export async function getArgs(execPath: string): Promise<Args> {
    const pyrightInfo = await getPyrightInfo();
    let pyrightPath: string | undefined;
    let command: string;
    switch (pyrightInfo.kind) {
        case "npm":
            pyrightPath = await downloadPyright(pyrightInfo);
            command = execPath;
            break;
        case "path":
            command = pyrightInfo.command;
            break;
    }

    const pyrightVersion = new SemVer(pyrightInfo.version);
    // https://github.com/microsoft/pyright/commit/ba18f421d1b57c433156cbc6934e0893abc130db
    const useDashedFlags = pyrightVersion.compare("1.1.309") === -1;

    const args = [];
    if (pyrightPath) {
        args.push(path.join(pyrightPath, "package", "index.js"));
    }

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

    const skipUnannotated = getBooleanInput("skip-unannotated", false);
    if (skipUnannotated) {
        args.push("--skipunannotated");
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

    let annotateInput = core.getInput("annotate").trim() || "all";
    if (isAnnotateNone(annotateInput)) {
        annotateInput = "";
    } else if (isAnnotateAll(annotateInput)) {
        annotateInput = "errors, warnings";
    }

    const split = annotateInput ? annotateInput.split(",") : [];
    const annotate = new Set<"error" | "warning">();

    for (let value of split) {
        value = value.trim();
        switch (value) {
            case "errors":
                annotate.add("error");
                break;
            case "warnings":
                annotate.add("warning");
                break;
            default:
                if (isAnnotateAll(value) || isAnnotateNone(value)) {
                    throw new Error(`invalid value ${JSON.stringify(value)} in comma-separated annotate`);
                }
                throw new Error(`invalid value ${JSON.stringify(value)} for annotate`);
        }
    }

    const noComments = getBooleanInput("no-comments", false)
        || args.some((arg) => flagsWithoutCommentingSupport.has(arg));

    if (noComments) {
        annotate.clear();
    }

    return {
        workingDirectory,
        annotate,
        pyrightVersion: pyrightInfo.version,
        command,
        args,
    };
}

function isAnnotateNone(name: string): boolean {
    return name === "none" || name.toUpperCase() === "FALSE";
}

function isAnnotateAll(name: string): boolean {
    return name === "all" || name.toUpperCase() === "TRUE";
}

function getBooleanInput(name: string, defaultValue: boolean): boolean {
    const input = core.getInput(name);
    if (!input) {
        return defaultValue;
    }
    return input.toUpperCase() === "TRUE";
}

const pyrightToolName = "pyright";

async function downloadPyright(info: PyrightInfoFromNpm): Promise<string> {
    // Note: this only works because the pyright package doesn't have any
    // dependencies. If this ever changes, we'll have to actually install it.
    // eslint-disable-next-line unicorn/no-array-callback-reference, unicorn/no-array-method-this-argument
    const found = tc.find(pyrightToolName, info.version);
    if (found) {
        return found;
    }

    const tarballPath = await tc.downloadTool(info.tarball);
    const extractedPath = await tc.extractTar(tarballPath);
    return await tc.cacheDir(extractedPath, pyrightToolName, info.version);
}

type PyrightInfo = PyrightInfoFromNpm | PyrightInfoFromPath;

type PyrightInfoFromNpm = { kind: "npm"; version: string; tarball: string; };
type PyrightInfoFromPath = { kind: "path"; version: string; command: string; };

async function getPyrightInfo(): Promise<PyrightInfo> {
    const version = await getPyrightVersion();
    if (version === "PATH") {
        const command = which.sync("pyright");
        const versionOut = cp.execFileSync(command, ["--version"], { encoding: "utf8" });
        const versionRaw = versionOut.trim().split(/\s+/).at(-1);
        if (!versionRaw) throw new Error(`Failed to parse pyright version from ${versionOut}`);
        const version = new SemVer(versionRaw).format();
        return {
            kind: "path",
            version,
            command: command,
        };
    }

    const client = new httpClient.HttpClient();
    const url = `https://registry.npmjs.org/pyright/${version}`;
    const resp = await client.get(url);
    const body = await resp.readBody();
    if (resp.message.statusCode !== httpClient.HttpCodes.OK) {
        throw new Error(`Failed to download metadata for pyright ${version} from ${url} -- ${body}`);
    }
    const parsed = parseNpmRegistryResponse(JSON.parse(body));
    return {
        kind: "npm",
        version: parsed.version,
        tarball: parsed.dist.tarball,
    };
}

async function getPyrightVersion(): Promise<string> {
    const versionSpec = core.getInput("version");
    if (versionSpec) {
        if (versionSpec.toUpperCase() === "PATH") {
            return "PATH";
        }
        return new SemVer(versionSpec).format();
    }

    const pylanceVersion = core.getInput("pylance-version");
    if (pylanceVersion) {
        if (pylanceVersion !== "latest-release" && pylanceVersion !== "latest-prerelease") {
            new SemVer(pylanceVersion); // validate version string
        }

        return await getPylancePyrightVersion(pylanceVersion);
    }

    return "latest";
}

async function getPylancePyrightVersion(pylanceVersion: string): Promise<string> {
    const client = new httpClient.HttpClient();
    const url = `https://raw.githubusercontent.com/microsoft/pylance-release/main/releases/${pylanceVersion}.json`;
    const resp = await client.get(url);
    const body = await resp.readBody();
    if (resp.message.statusCode !== httpClient.HttpCodes.OK) {
        throw new Error(`Failed to download release metadata for Pylance ${pylanceVersion} from ${url} -- ${body}`);
    }

    const buildMetadata = parsePylanceBuildMetadata(JSON.parse(body));
    const pyrightVersion = buildMetadata.pyrightVersion;

    core.info(`Pylance ${pylanceVersion} uses pyright ${pyrightVersion}`);

    return pyrightVersion;
}
