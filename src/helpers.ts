import * as core from '@actions/core';
import * as httpClient from '@actions/http-client';
import * as tc from '@actions/tool-cache';
import * as path from 'path';
import SemVer from 'semver/classes/semver';
import stringArgv from 'string-argv';

import { NpmRegistryResponse } from './schema';

export function getNodeInfo() {
    return {
        version: process.version,
        execPath: process.execPath,
    };
}

export async function getArgs() {
    const pyrightVersion = await getPyrightVersion();
    const pyrightPath = await downloadPyright(pyrightVersion);

    const args = [pyrightPath];

    const workingDirectory = core.getInput('working-directory');

    const noComments = getBooleanInput('no-comments', false);
    if (!noComments) {
        args.push('--outputjson');
    }

    const pythonPlatform = core.getInput('python-platform');
    if (pythonPlatform) {
        args.push('--pythonplatform');
        args.push(pythonPlatform);
    }

    const pythonVersion = core.getInput('python-version');
    if (pythonVersion) {
        args.push('--pythonversion');
        args.push(pythonVersion);
    }

    const typeshedPath = core.getInput('typeshed-path');
    if (typeshedPath) {
        args.push('--typeshed-path');
        args.push(typeshedPath);
    }

    const venvPath = core.getInput('venv-path');
    if (venvPath) {
        args.push('--venv-path');
        args.push(venvPath);
    }

    const project = core.getInput('project');
    if (project) {
        args.push('--project');
        args.push(project);
    }

    const lib = getBooleanInput('lib', false);
    if (lib) {
        args.push('--lib');
    }

    const warnings = getBooleanInput('warnings', false);
    if (warnings) {
        args.push('--warnings');
    }

    const verifyTypes = core.getInput('verify-types');
    if (verifyTypes) {
        args.push('--verifytypes');
        args.push(verifyTypes);
    }

    const extraArgs = core.getInput('extra-args');
    if (extraArgs) {
        args.push(...stringArgv(extraArgs));
    }

    return {
        workingDirectory,
        noComments,
        pyrightVersion,
        args,
    };
}

function getBooleanInput(name: string, defaultValue: boolean): boolean {
    const input = core.getInput(name);
    if (!input) {
        return defaultValue;
    }
    return input.toUpperCase() === 'TRUE';
}

async function getPyrightVersion(): Promise<SemVer> {
    const versionSpec = core.getInput('version');
    if (versionSpec) {
        return new SemVer(versionSpec);
    }

    const client = new httpClient.HttpClient();
    const resp = await client.get('https://registry.npmjs.org/pyright/latest');
    const body = await resp.readBody();
    const obj = NpmRegistryResponse.parse(JSON.parse(body));
    return new SemVer(obj.version);
}

async function downloadPyright(version: SemVer): Promise<string> {
    // Note: this only works because the pyright package doesn't have any
    // dependencies. If this ever changes, we'll have to actually install it.
    const url = `https://registry.npmjs.org/pyright/-/pyright-${version.format()}.tgz`;
    const pyrightTarball = await tc.downloadTool(url);
    const pyright = await tc.extractTar(pyrightTarball);
    return path.join(pyright, 'package', 'index.js');
}
