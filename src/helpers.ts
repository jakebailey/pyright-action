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

export function getNodeInfo(): NodeInfo {
    return {
        version: process.version,
        execPath: process.execPath,
    };
}

export interface Args {
    workingDirectory: string;
    noComments: boolean;
    pyrightVersion: string;
    args: readonly string[];
}

export async function getArgs() {
    const pyrightInfo = await getPyrightInfo();
    const pyrightPath = await downloadPyright(pyrightInfo);

    const args = [path.join(pyrightPath, "package", "index.js")];

    const workingDirectory = core.getInput("working-directory");

    const noComments = getBooleanInput("no-comments", false);

    const pythonPlatform = core.getInput("python-platform");
    if (pythonPlatform) {
        args.push("--pythonplatform", pythonPlatform);
    }

    const pythonVersion = core.getInput("python-version");
    if (pythonVersion) {
        args.push("--pythonversion", pythonVersion);
    }

    const typeshedPath = core.getInput("typeshed-path");
    if (typeshedPath) {
        args.push("--typeshed-path", typeshedPath);
    }

    const venvPath = core.getInput("venv-path");
    if (venvPath) {
        args.push("--venv-path", venvPath);
    }

    const project = core.getInput("project");
    if (project) {
        args.push("--project", project);
    }

    const lib = getBooleanInput("lib", false);
    if (lib) {
        args.push("--lib");
    }

    const warnings = getBooleanInput("warnings", false);
    if (warnings) {
        args.push("--warnings");
    }

    const verifyTypes = core.getInput("verify-types");
    if (verifyTypes) {
        args.push("--verifytypes", verifyTypes);
    }

    const ignoreExternal = core.getInput("ignore-external");
    if (ignoreExternal) {
        args.push("--ignoreexternal");
    }

    const extraArgs = core.getInput("extra-args");
    if (extraArgs) {
        for (const arg of parse(extraArgs)) {
            if (typeof arg !== "string") {
                // eslint-disable-next-line unicorn/prefer-type-error
                throw new Error(`invalid value in extra-args: ${JSON.stringify(arg)}`);
            }
            args.push(arg);
        }
    }

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
    const version = getPyrightVersion();
    const client = new httpClient.HttpClient();
    const resp = await client.get(`https://registry.npmjs.org/pyright/${version}`);
    const body = await resp.readBody();
    if (resp.message.statusCode !== httpClient.HttpCodes.OK) {
        throw new Error(body);
    }
    return parseNpmRegistryResponse(JSON.parse(body));
}

function getPyrightVersion() {
    const versionSpec = core.getInput("version");
    if (versionSpec) {
        return new SemVer(versionSpec).format();
    }
    return "latest";
}
