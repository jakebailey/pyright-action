import * as core from '@actions/core';
import * as command from '@actions/core/lib/command';
import * as tc from '@actions/tool-cache';
import * as cp from 'child_process';
import * as path from 'path';
import SemVer from 'semver/classes/semver';
import stringArgv from 'string-argv';

import { Diagnostic, isEmptyRange, Report } from './schema';

export async function main() {
    try {
        const cwd = core.getInput('working-directory');
        if (cwd) {
            process.chdir(cwd);
        }

        const args = await getArgs();

        const { status, stdout } = cp.spawnSync(process.execPath, args, {
            encoding: 'utf-8',
            stdio: ['ignore', 'pipe', 'inherit'],
        });

        if (!stdout.trim()) {
            // Process crashed. stderr was inherited, so just mark the step as failed.
            core.setFailed(`Exit code ${status}`);
            return;
        }

        const report = Report.parse(JSON.parse(stdout));

        report.generalDiagnostics.forEach((diag) => {
            // TODO: Only do this logging on info?
            console.log(diagnosticToString(diag, /* forCommand */ false));

            if (diag.severity === 'information') {
                return;
            }

            const line = diag.range?.start.line ?? 0;
            const col = diag.range?.start.character ?? 0;
            const message = diagnosticToString(diag, /* forCommand */ true);

            command.issueCommand(
                diag.severity,
                {
                    file: diag.file,
                    line: line + 1,
                    col: col + 1,
                },
                message
            );
        });

        const { errorCount, warningCount, informationCount } = report.summary;

        console.log(
            `${errorCount} ${errorCount === 1 ? 'error' : 'errors'}, ` +
                `${warningCount} ${warningCount === 1 ? 'warning' : 'warnings'}, ` +
                `${informationCount} ${informationCount === 1 ? 'info' : 'infos'} `
        );

        if (status !== 0) {
            core.setFailed(`${errorCount} ${errorCount === 1 ? 'error' : 'errors'}`);
        }
    } catch (e) {
        core.setFailed(e.message);
    }
}

async function getArgs(): Promise<string[]> {
    const versionSpec = core.getInput('version');
    const version = versionSpec ? new SemVer(versionSpec) : undefined;

    const pyrightIndex = await getPyright(version);

    const args = [pyrightIndex, '--outputjson'];

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

    const lib = (core.getInput('lib') || 'false').toUpperCase() === 'TRUE';
    if (lib) {
        args.push('--lib');
    }

    const extraArgs = core.getInput('extra-args');
    if (extraArgs) {
        args.push(...stringArgv(extraArgs));
    }

    return args;
}

function pyrightUrl(version?: SemVer): string {
    if (!version) {
        // TODO: Do this better.
        return cp.execFileSync('npm', ['view', 'pyright', 'dist.tarball'], { encoding: 'utf-8' }).trim();
    }
    return `https://registry.npmjs.org/pyright/-/pyright-${version.format()}.tgz`;
}

async function getPyright(version?: SemVer): Promise<string> {
    const url = pyrightUrl(version);

    const pyrightTarball = await tc.downloadTool(url);
    const pyright = await tc.extractTar(pyrightTarball);
    return path.join(pyright, 'package', 'index.js');
}

// Copied from pyright, with modifications.
function diagnosticToString(diag: Diagnostic, forCommand: boolean, prefix = ''): string {
    let message = prefix;

    if (!forCommand) {
        if (diag.file) {
            message += `${diag.file}:`;
        }
        if (diag.range && !isEmptyRange(diag.range)) {
            message += `${diag.range.start.line + 1}:${diag.range.start.character + 1} - `;
        }
    }

    const [firstLine, ...remainingLines] = diag.message.split('\n');

    if (!forCommand) {
        message += diag.severity === 'information' ? 'info' : diag.severity;
        message += `: `;
    }

    message += firstLine;
    if (remainingLines.length > 0) {
        message += '\n' + prefix + remainingLines.join('\n' + prefix);
    }

    if (diag.rule) {
        message += ` (${diag.rule})`;
    }

    return message;
}
