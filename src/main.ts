/**
 * Pyright Action v3 - Main Implementation
 *
 * This file contains the core logic for running pyright with GitHub Actions integration.
 *
 * v3 Features:
 * - Stats Budget Enforcement: Monitor and fail builds based on analysis time thresholds
 * - Type Coverage Thresholds: Require minimum completeness percentages for verify-types
 * - SARIF Integration: Generate security-compatible reports for GitHub
 * - Enhanced PR Comments: Detailed performance and coverage reporting (TODO: GitHub API)
 * - Backward Compatibility: All v2 functionality preserved
 *
 * Flow:
 * 1. Parse action inputs and determine pyright version/command
 * 2. Add v3 flags (--stats, --outputjson) as needed
 * 3. Execute pyright with appropriate stdio handling
 * 4. Parse JSON output for diagnostics and v3 metrics
 * 5. Process annotations for PR/commit comments (v2 feature)
 * 6. Check v3 feature constraints (stats budget, coverage threshold)
 * 7. Generate optional outputs (SARIF, PR comments)
 * 8. Report results and fail appropriately
 */

import assert from "node:assert";
import * as cp from "node:child_process";
import * as fs from "node:fs";
import * as path from "node:path";
import { inspect } from "node:util";

import * as core from "@actions/core";
import * as actionsCommand from "@actions/core/lib/command";
import * as TOML from "@iarna/toml";
import * as JSONC from "jsonc-parser";
import { SemVer } from "semver";
import { quote } from "shell-quote";

import { getActionVersion, getArgs, getNodeInfo, type NodeInfo } from "./helpers";
import {
    type Diagnostic,
    type FileStat,
    isEmptyRange,
    parseReport,
    type Report,
    type VerifyTypesStats,
} from "./schema";

function printInfo(pyrightVersion: SemVer, node: NodeInfo, cwd: string, command: string, args: readonly string[]) {
    core.info(`pyright ${pyrightVersion.format()}, node ${node.version}, pyright-action ${getActionVersion()}`);
    core.info(`Working directory: ${cwd}`);
    core.info(`Running: ${quote([command, ...args])}`);
}

/**
 * v3: Handle annotations for errors/warnings (extracted from main for modularity)
 */
async function handleAnnotations(report: Report, annotate: ReadonlySet<"error" | "warning">) {
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

        // This is technically a log line and duplicates the core.info above,
        // but we want to have the below look nice in commit comments.
        actionsCommand.issueCommand(
            diag.severity,
            {
                file: diag.file,
                line: line + 1,
                col: col + 1,
            },
            message,
        );
    }
}

/**
 * v3: Check stats budget and return files that exceed the threshold
 */
function checkStatsBudget(files: FileStat[], budgetMs: number): FileStat[] {
    return files
        .filter((file) => file.timeInSec * 1000 > budgetMs)
        .sort((a, b) => b.timeInSec - a.timeInSec);
}

/**
 * v3: Post PR comment with slow files information
 * TODO: Implement actual GitHub API integration using @actions/github
 */
async function postSlowFilesComment(slowFiles: FileStat[], budgetMs: number, top: number): Promise<void> {
    const topSlowFiles = slowFiles.slice(0, top);
    const lines = [
        `⚠️ **${slowFiles.length} file(s) exceeded the stats budget of ${budgetMs}ms:**`,
        "",
        ...topSlowFiles.map((file) => `- \`${file.path}\`: ${Math.round(file.timeInSec * 1000)}ms`),
    ];

    if (slowFiles.length > top) {
        lines.push(`- ... and ${slowFiles.length - top} more file(s)`);
    }

    core.info("Slow files comment would be posted:");
    core.info(lines.join("\n"));
    // TODO: Implement actual PR comment posting using @actions/github
}

/**
 * v3: Post PR comment with type coverage information
 * TODO: Implement actual GitHub API integration using @actions/github
 */
async function postCoverageComment(stats: VerifyTypesStats): Promise<void> {
    const lines = [
        `📊 **Type Coverage Summary:**`,
        "",
        `- **Completeness Score:** ${stats.completenessScore?.toFixed(1) ?? "N/A"}%`,
        `- **Modules:** ${stats.moduleCount ?? "N/A"}`,
        `- **Symbols:** ${stats.completedSymbolCount ?? "N/A"}/${stats.symbolCount ?? "N/A"}`,
    ];

    if (stats.packageName) {
        lines.unshift(`**Package:** ${stats.packageName}`);
        lines.unshift("");
    }

    core.info("Coverage comment would be posted:");
    core.info(lines.join("\n"));
    // TODO: Implement actual PR comment posting using @actions/github
}

/**
 * v3: Generate SARIF file for GitHub security tab integration
 * TODO: Implement SARIF upload using github.rest.codeScanning.uploadSarif
 */
async function generateSarif(report: Report): Promise<void> {
    const sarif = {
        version: "2.1.0",
        $schema: "https://raw.githubusercontent.com/oasis-tcs/sarif-spec/master/Schemata/sarif-schema-2.1.0.json",
        runs: [
            {
                tool: {
                    driver: {
                        name: "pyright",
                        version: "unknown",
                        informationUri: "https://github.com/microsoft/pyright",
                    },
                },
                results: report.generalDiagnostics
                    .filter((diag) => diag.severity === "error" || diag.severity === "warning")
                    .map((diag) => ({
                        ruleId: diag.rule,
                        level: diag.severity === "error" ? "error" : "warning",
                        message: {
                            text: diag.message,
                        },
                        locations: diag.range && diag.file
                            ? [
                                {
                                    physicalLocation: {
                                        artifactLocation: {
                                            uri: diag.file,
                                        },
                                        region: {
                                            startLine: diag.range.start.line + 1,
                                            startColumn: diag.range.start.character + 1,
                                            endLine: diag.range.end.line + 1,
                                            endColumn: diag.range.end.character + 1,
                                        },
                                    },
                                },
                            ]
                            : [],
                    })),
            },
        ],
    };

    const sarifPath = "pyright-results.sarif";
    fs.writeFileSync(sarifPath, JSON.stringify(sarif, undefined, 2));
    core.info(`SARIF file generated: ${sarifPath}`);

    // TODO: Upload SARIF to GitHub using github.rest.codeScanning.uploadSarif
    core.info("SARIF upload would be performed here");
}

export async function main() {
    try {
        const node = getNodeInfo(process);
        const {
            workingDirectory,
            annotate,
            pyrightVersion,
            command,
            args,
            statsBudgetMs,
            statsTop,
            verifyThreshold,
            sarif,
            commentSlow,
            commentCoverage,
        } = await getArgs(node.execPath);

        if (workingDirectory) {
            process.chdir(workingDirectory);
        }

        try {
            checkOverriddenFlags(pyrightVersion, args);
        } catch {
            // Just ignore.
        }

        // v3: Always use --outputjson for processing results, even if annotations are disabled
        const updatedArgs = [...args];
        if (!updatedArgs.includes("--outputjson")) {
            updatedArgs.push("--outputjson");
        }

        // v3: Add --stats if stats budget is specified for performance monitoring
        if (statsBudgetMs && !updatedArgs.includes("--stats")) {
            updatedArgs.push("--stats");
        }

        // v3: If no features need JSON processing, run pyright directly for performance
        if (annotate.size === 0 && !statsBudgetMs && !verifyThreshold && !sarif) {
            printInfo(pyrightVersion, node, process.cwd(), command, args);
            // Direct execution without JSON processing for maximum performance
            const { status } = cp.spawnSync(command, args, {
                stdio: ["ignore", "inherit", "inherit"],
            });

            if (status !== 0) {
                core.setFailed(`Exit code ${status!}`);
            }
            return;
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

        // Handle annotations for errors/warnings (v2 compatibility)
        await handleAnnotations(report, annotate);

        // v3: Handle new features with consolidated failure tracking
        const failures: string[] = [];

        // v3: Check stats budget for performance monitoring
        if (statsBudgetMs && report.stats?.files) {
            const slowFiles = checkStatsBudget(report.stats.files, statsBudgetMs);
            if (slowFiles.length > 0) {
                failures.push(`${slowFiles.length} file(s) exceeded stats budget of ${statsBudgetMs}ms`);

                // v3: Optional PR comment for slow files
                if (commentSlow ?? true) {
                    await postSlowFilesComment(slowFiles, statsBudgetMs, statsTop ?? 5);
                }
            }
        }

        // v3: Check verify-types threshold for type completeness
        if (verifyThreshold !== undefined && report.verifyTypesStats?.completenessScore !== undefined) {
            const score = report.verifyTypesStats.completenessScore;
            if (score < verifyThreshold) {
                failures.push(`Type completeness ${score.toFixed(1)}% is below threshold of ${verifyThreshold}%`);
            }

            // v3: Optional PR comment for coverage summary
            if (commentCoverage ?? true) {
                await postCoverageComment(report.verifyTypesStats);
            }
        }

        // v3: Generate SARIF if requested for GitHub security tab integration
        if (sarif) {
            await generateSarif(report);
        }

        // Report summary (existing v2 functionality)
        const { errorCount, warningCount, informationCount } = report.summary;
        core.info(
            [
                pluralize(errorCount, "error", "errors"),
                pluralize(warningCount, "warning", "warnings"),
                pluralize(informationCount, "information", "informations"),
            ].join(", "),
        );

        // v3: Fail if there are errors, warnings (if configured), or v3 failures
        if (status !== 0 || failures.length > 0) {
            const allFailures = [];
            if (errorCount > 0) {
                allFailures.push(pluralize(errorCount, "error", "errors"));
            }
            allFailures.push(...failures);
            core.setFailed(allFailures.join("; "));
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

// Configuration override detection - warns users about conflicting settings
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
