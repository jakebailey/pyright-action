import assert from "node:assert";
import * as cp from "node:child_process";
import * as fs from "node:fs";
import * as path from "node:path";
import { inspect } from "node:util";

import * as core from "@actions/core";
import * as TOML from "@iarna/toml";
import * as JSONC from "jsonc-parser";
import { SemVer } from "semver";
import { quote } from "shell-quote";

import { getActionVersion, getArgs, getNodeInfo, type NodeInfo } from "./helpers";
import { type Diagnostic, isEmptyRange, parseReport } from "./schema";

function printInfo(pyrightVersion: SemVer, node: NodeInfo, cwd: string, command: string, args: readonly string[]) {
    core.info(`pyright ${pyrightVersion.format()}, node ${node.version}, pyright-action ${getActionVersion()}`);
    core.info(`Working directory: ${cwd}`);
    core.info(`Running: ${quote([command, ...args])}`);
}

export async function main() {
    try {
        const node = getNodeInfo(process);
        const { workingDirectory, annotate, pyrightVersion, command, args } = await getArgs(node.execPath);
        if (workingDirectory) {
            process.chdir(workingDirectory);
        }

        try {
            checkOverriddenFlags(pyrightVersion, args);
        } catch {
            // Just ignore.
        }

        if (annotate.size === 0) {
            printInfo(pyrightVersion, node, process.cwd(), command, args);
            // If comments are disabled, there's no point in directly processing the output,
            // as it's only used for comments.
            // If we're running the type verifier, there's no guarantee that we can even act
            // on the output besides the exit code.
            //
            // So, in either case, just directly run pyright and exit with its status.
            const { status } = cp.spawnSync(command, args, {
                stdio: ["ignore", "inherit", "inherit"],
            });

            if (status !== 0) {
                core.setFailed(`Exit code ${status!}`);
            }
            return;
        }

        const updatedArgs = [...args];
        if (!updatedArgs.includes("--outputjson")) {
            updatedArgs.push("--outputjson");
        }

        printInfo(pyrightVersion, node, process.cwd(), command, updatedArgs);

        const { status, stdout } = cp.spawnSync(command, updatedArgs, {
            encoding: "utf8",
            stdio: ["ignore", "pipe", "inherit"],
            maxBuffer: 100 * 1024 * 1024, // 100 MB "ought to be enough for anyone"; https://github.com/nodejs/node/issues/9829
        });

        if (!stdout.trim()) {
            // Process crashed. stderr was inherited, so just mark the step as failed.
            core.setFailed(`Exit code ${status!}`);
            return;
        }

        const report = parseReport(JSON.parse(stdout));

        for (const diag of report.generalDiagnostics) {
            core.info(diagnosticToString(diag, /* forCommand */ false));

            if (diag.severity === "information") {
                continue;
            }

            if (!annotate.has(diag.severity)) {
                continue;
            }

            const line = diag.range?.start.line ?? 0;
            const col = diag.range?.start.character ?? 0;
            const message = diagnosticToString(diag, /* forCommand */ true);

            const properties: core.AnnotationProperties = {
                file: diag.file,
                startLine: line + 1,
                startColumn: col + 1,
            };

            if (diag.severity === "error") {
                core.error(message, properties);
            } else if (diag.severity === "warning") {
                core.warning(message, properties);
            }
        }

        const { errorCount, warningCount, informationCount } = report.summary;

        core.info(
            [
                pluralize(errorCount, "error", "errors"),
                pluralize(warningCount, "warning", "warnings"),
                pluralize(informationCount, "information", "informations"),
            ].join(", "),
        );

        if (status !== 0) {
            core.setFailed(pluralize(errorCount, "error", "errors"));
        }
    } catch (e) {
        assert.ok(typeof e === "string" || e instanceof Error);
        core.setFailed(e);
    }
}

// Copied from pyright, with modifications.
function diagnosticToString(diag: Diagnostic, forCommand: boolean): string {
    let message = "";

    if (!forCommand) {
        if (diag.file) {
            message += `${diag.file}:`;
        }
        if (diag.range && !isEmptyRange(diag.range)) {
            message += `${diag.range.start.line + 1}:${diag.range.start.character + 1} -`;
        }
        message += ` ${diag.severity}: `;
    }

    message += diag.message;

    if (diag.rule) {
        message += ` (${diag.rule})`;
    }

    return message;
}

function pluralize(n: number, singular: string, plural: string) {
    return `${n} ${n === 1 ? singular : plural}`;
}

const flagsOverriddenByConfig352AndAfter = new Set([
    // pyright warns about these itself, but still takes the config file.
    // Report these anyway, as the user should really stop configuring the action with these.
    "--typeshedpath",
    "--venvpath",
]);

// These settings have no effect when also set in a pyrightconfig.json.
// https://github.com/microsoft/pyright/issues/7330
export const flagsOverriddenByConfig351AndBefore = new Set([
    "--pythonplatform",
    "--pythonversion",
    ...flagsOverriddenByConfig352AndAfter,
]);

function getFlagsOverriddenByConfig(version: SemVer): ReadonlySet<string> {
    return version.compare("1.1.352") === -1
        ? flagsOverriddenByConfig351AndBefore
        : flagsOverriddenByConfig352AndAfter;
}

function checkOverriddenFlags(version: SemVer, args: readonly string[]) {
    const flagsOverriddenByConfig = getFlagsOverriddenByConfig(version);

    const overriddenFlags = new Set(
        args.map((arg) => arg.toLowerCase()).filter((arg) => flagsOverriddenByConfig.has(arg)),
    );
    if (overriddenFlags.size === 0) {
        return;
    }

    let configPath: string | undefined;
    for (let i = 0; i < args.length; i++) {
        if (args[i] === "-p" || args[i] === "--project") {
            configPath = args[i + 1];
            break;
        }
    }

    if (configPath && !configPath.endsWith(".json")) {
        configPath = path.posix.join(configPath, "pyrightconfig.json");
    }

    configPath ??= "pyrightconfig.json";

    let parsed: unknown;
    if (fs.existsSync(configPath)) {
        const errors: JSONC.ParseError[] = [];
        parsed = JSONC.parse(fs.readFileSync(configPath, "utf8"), errors, {
            allowTrailingComma: true,
        });
        if (errors.length > 0) {
            return;
        }
    } else {
        let cwd = process.cwd();
        const root = path.parse(cwd).root;

        while (cwd !== root) {
            const pyprojectPath = path.posix.join(cwd, "pyproject.toml");
            if (fs.existsSync(pyprojectPath)) {
                const pyproject = TOML.parse(fs.readFileSync(pyprojectPath, "utf8"));
                parsed = (pyproject as { tool: { pyright: any; }; })["tool"]["pyright"];
                configPath = pyprojectPath;
                break;
            }
            cwd = path.dirname(cwd);
        }
    }

    if (parsed !== undefined && parsed !== null) {
        for (const [key, value] of Object.entries<unknown>(parsed as {})) {
            const flag = `--${key.toLowerCase()}`;
            if (overriddenFlags.has(flag)) {
                core.warning(
                    `${configPath} contains ${
                        inspect({ [key]: value })
                    }; ${flag} as passed by pyright-action will have no effect.`,
                );
            }
        }
    }
}
