/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable unicorn/no-null */
import * as cp from "node:child_process";
import * as fs from "node:fs";

import * as core from "@actions/core";
import * as command from "@actions/core/lib/command";
import * as TOML from "@iarna/toml";
import { SemVer } from "semver";
import { afterEach, beforeEach, describe, expect, test, vitest } from "vitest";

import * as helpers from "./helpers";

const nodeVersion = "v24.12.0";
const nodeExecPath = "/path/to/node";
const pyrightVersion = new SemVer("1.1.240");

vitest.mock("@actions/core");
const mockedCore = vitest.mocked(core);
vitest.mock("@actions/core/lib/command");
const mockedCommand = vitest.mocked(command);
vitest.mock("node:child_process");
const mockedCp = vitest.mocked(cp);
vitest.mock("./helpers");
const mockedHelpers = vitest.mocked(helpers);
vitest.mock("node:fs");
const mockedFs = vitest.mocked(fs);

const mockedProcessChdir = vitest.spyOn(process, "chdir");
const mockedProcessCwd = vitest.spyOn(process, "cwd");

let currentWorkingDirectory = "/some/default/cwd";

import { flagsOverriddenByConfig351AndBefore, main } from "./main";
import type { Report } from "./schema";

beforeEach(() => {
    vitest.clearAllMocks();
    mockedHelpers.getNodeInfo.mockReturnValue({
        version: nodeVersion,
        execPath: nodeExecPath,
    });
    mockedHelpers.getActionVersion.mockReturnValue("1.1.0");
    mockedProcessChdir.mockImplementation((dir) => {
        currentWorkingDirectory = dir;
    });
    mockedProcessCwd.mockImplementation(() => currentWorkingDirectory);
});

afterEach(() => {
    expect(mockedProcessChdir.mock.calls).toMatchSnapshot("process.chdir");
    expect(mockedCore.setFailed.mock.calls).toMatchSnapshot("core.setFailed");
    expect(mockedCore.info.mock.calls).toMatchSnapshot("core.info");
    expect(mockedCore.warning.mock.calls).toMatchSnapshot("core.warning");
    expect(mockedCore.error.mock.calls).toMatchSnapshot("core.error");
    expect(mockedCommand.issueCommand.mock.calls).toMatchSnapshot("command.issueCommand");
    expect(mockedCp.spawnSync.mock.calls).toMatchSnapshot("cp.spawnSync");
    expect(mockedFs.readFileSync.mock.calls).toMatchSnapshot("fs.readFileSync");
    expect(mockedFs.existsSync.mock.calls).toMatchSnapshot("fs.existsSync");
});

test("thrown error at first call", async () => {
    mockedHelpers.getNodeInfo.mockImplementation(() => {
        throw new Error("oops");
    });

    await main();
});

describe("no comments", () => {
    const args = ["/path/to/pyright/dist/index.js", "--outputjson"];
    const wd = "/some/wd";

    beforeEach(() => {
        mockedHelpers.getArgs.mockResolvedValue({
            annotate: new Set(),
            workingDirectory: wd,
            pyrightVersion,
            command: nodeExecPath,
            args,
        });
    });

    test("success", async () => {
        mockedCp.spawnSync.mockImplementation(() => ({
            pid: -1,
            output: [],
            stdout: "" as any,
            stderr: "" as any,
            status: 0,
            signal: null,
        }));

        await main();
    });

    test("failure", async () => {
        mockedCp.spawnSync.mockImplementation(() => ({
            pid: -1,
            output: [],
            stdout: "" as any,
            stderr: "" as any,
            status: 1,
            signal: null,
        }));

        await main();
    });
});

describe("with comments", () => {
    const args = ["/path/to/pyright/dist/index.js"];

    beforeEach(() => {
        mockedHelpers.getArgs.mockResolvedValue({
            annotate: new Set(["error", "warning"]),
            workingDirectory: "",
            pyrightVersion,
            command: nodeExecPath,
            args,
        });
    });

    test("failure", async () => {
        mockedCp.spawnSync.mockImplementation(() => ({
            pid: -1,
            output: [],
            stdout: "" as any,
            stderr: "" as any,
            status: 2,
            signal: null,
        }));

        await main();
    });

    test("unparsable json", async () => {
        mockedCp.spawnSync.mockImplementation(() => ({
            pid: -1,
            output: [],
            stdout: "}" as any,
            stderr: "" as any,
            status: 0,
            signal: null,
        }));

        await main();
    });

    test("invalid stdout", async () => {
        mockedCp.spawnSync.mockImplementation(() => ({
            pid: -1,
            output: [],
            stdout: "{}" as any,
            stderr: "" as any,
            status: 0,
            signal: null,
        }));

        await main();
    });

    test("no diagnostics", async () => {
        mockedCp.spawnSync.mockImplementation(() => ({
            pid: -1,
            output: [],
            stdout: reportToString({
                generalDiagnostics: [],
                summary: {
                    errorCount: 0,
                    warningCount: 0,
                    informationCount: 0,
                },
            }) as any,
            stderr: "" as any,
            status: 0,
            signal: null,
        }));

        await main();
    });

    test("with diagnostics", async () => {
        mockedCp.spawnSync.mockImplementation(() => ({
            pid: -1,
            output: [],
            stdout: reportToString({
                generalDiagnostics: [
                    {
                        file: "/path/to/file1.py",
                        range: { start: { line: 0, character: 0 }, end: { line: 1, character: 1 } },
                        severity: "error",
                        message: "some error",
                    },
                    {
                        file: "/path/to/file2.py",
                        range: { start: { line: 0, character: 0 }, end: { line: 0, character: 0 } },
                        severity: "warning",
                        message: "some warning",
                    },
                    {
                        file: "/path/to/file3.py",
                        range: { start: { line: 0, character: 0 }, end: { line: 1, character: 1 } },
                        severity: "information",
                        message: "some info",
                        rule: "reportSomeInformation",
                    },
                    {
                        file: "/path/to/file3.py",
                        severity: "warning",
                        message: "another warning",
                        rule: "reportSomeWarning",
                    },
                    {
                        file: "/path/to/file1.py",
                        range: { start: { line: 5, character: 9 }, end: { line: 5, character: 15 } },
                        severity: "error",
                        message: "some error",
                    },
                ],
                summary: {
                    errorCount: 2,
                    warningCount: 2,
                    informationCount: 1,
                },
            }) as any,
            stderr: "" as any,
            status: 1,
            signal: null,
        }));

        await main();
    });

    test("errors", async () => {
        mockedHelpers.getArgs.mockResolvedValue({
            annotate: new Set(["error"]),
            workingDirectory: "",
            pyrightVersion,
            command: nodeExecPath,
            args,
        });

        mockedCp.spawnSync.mockImplementation(() => ({
            pid: -1,
            output: [],
            stdout: reportToString({
                generalDiagnostics: [
                    {
                        file: "/path/to/file1.py",
                        range: { start: { line: 0, character: 0 }, end: { line: 1, character: 1 } },
                        severity: "error",
                        message: "some error",
                    },
                    {
                        file: "/path/to/file2.py",
                        range: { start: { line: 0, character: 0 }, end: { line: 0, character: 0 } },
                        severity: "warning",
                        message: "some warning",
                    },
                    {
                        file: "/path/to/file3.py",
                        range: { start: { line: 0, character: 0 }, end: { line: 1, character: 1 } },
                        severity: "information",
                        message: "some info",
                        rule: "reportSomeInformation",
                    },
                    {
                        file: "/path/to/file3.py",
                        severity: "warning",
                        message: "another warning",
                        rule: "reportSomeWarning",
                    },
                    {
                        file: "/path/to/file1.py",
                        range: { start: { line: 5, character: 9 }, end: { line: 5, character: 15 } },
                        severity: "error",
                        message: "some error",
                    },
                ],
                summary: {
                    errorCount: 2,
                    warningCount: 2,
                    informationCount: 1,
                },
            }) as any,
            stderr: "" as any,
            status: 1,
            signal: null,
        }));

        await main();
    });

    test("errors,warnings", async () => {
        mockedHelpers.getArgs.mockResolvedValue({
            annotate: new Set(["error", "warning"]),
            workingDirectory: "",
            pyrightVersion,
            command: nodeExecPath,
            args,
        });

        mockedCp.spawnSync.mockImplementation(() => ({
            pid: -1,
            output: [],
            stdout: reportToString({
                generalDiagnostics: [
                    {
                        file: "/path/to/file1.py",
                        range: { start: { line: 0, character: 0 }, end: { line: 1, character: 1 } },
                        severity: "error",
                        message: "some error",
                    },
                    {
                        file: "/path/to/file2.py",
                        range: { start: { line: 0, character: 0 }, end: { line: 0, character: 0 } },
                        severity: "warning",
                        message: "some warning",
                    },
                    {
                        file: "/path/to/file3.py",
                        range: { start: { line: 0, character: 0 }, end: { line: 1, character: 1 } },
                        severity: "information",
                        message: "some info",
                        rule: "reportSomeInformation",
                    },
                    {
                        file: "/path/to/file3.py",
                        severity: "warning",
                        message: "another warning",
                        rule: "reportSomeWarning",
                    },
                    {
                        file: "/path/to/file1.py",
                        range: { start: { line: 5, character: 9 }, end: { line: 5, character: 15 } },
                        severity: "error",
                        message: "some error",
                    },
                ],
                summary: {
                    errorCount: 2,
                    warningCount: 2,
                    informationCount: 1,
                },
            }) as any,
            stderr: "" as any,
            status: 1,
            signal: null,
        }));

        await main();
    });

    test("with 1 each", async () => {
        mockedCp.spawnSync.mockImplementation(() => ({
            pid: -1,
            output: [],
            stdout: reportToString({
                generalDiagnostics: [
                    {
                        file: "/path/to/file1.py",
                        range: { start: { line: 0, character: 0 }, end: { line: 1, character: 1 } },
                        severity: "error",
                        message: "some error",
                    },
                    {
                        file: "/path/to/file2.py",
                        range: { start: { line: 0, character: 0 }, end: { line: 0, character: 0 } },
                        severity: "warning",
                        message: "some warning",
                    },
                    {
                        file: "/path/to/file3.py",
                        range: { start: { line: 0, character: 0 }, end: { line: 1, character: 1 } },
                        severity: "information",
                        message: "some info",
                        rule: "reportSomeInformation",
                    },
                ],
                summary: {
                    errorCount: 1,
                    warningCount: 1,
                    informationCount: 1,
                },
            }) as any,
            stderr: "" as any,
            status: 1,
            signal: null,
        }));

        await main();
    });
});

describe("with overridden flags", () => {
    const wd = "/some/wd/is/deep";

    const config = {
        pythonPlatform: "Linux",
        pythonVersion: "3.9",
        typeshedPath: "/path/to/typeshed",
        venvPath: "/path/to/venv",
    };

    const configJSON = JSON.stringify(config);

    const configToml = TOML.stringify({
        tool: {
            pyright: config,
        },
    });

    const flags = [...flagsOverriddenByConfig351AndBefore];

    beforeEach(() => {
        mockedCp.spawnSync.mockImplementation(() => ({
            pid: -1,
            output: [],
            stdout: "" as any,
            stderr: "" as any,
            status: 0,
            signal: null,
        }));
    });

    test("implicit pyrightconfig.json", async () => {
        mockedHelpers.getArgs.mockResolvedValue({
            annotate: new Set(),
            workingDirectory: wd,
            pyrightVersion,
            command: nodeExecPath,
            args: flags,
        });

        mockedFs.readFileSync.mockImplementation(
            ((p) => {
                expect(p).toBe("pyrightconfig.json");
                return configJSON;
            }) as typeof fs.readFileSync,
        );

        mockedFs.existsSync.mockImplementation((p) => {
            expect(p).toBe("pyrightconfig.json");
            return true;
        });

        await main();
    });

    test("implicit pyrightconfig.json 1.1.350", async () => {
        mockedHelpers.getArgs.mockResolvedValue({
            annotate: new Set(),
            workingDirectory: wd,
            pyrightVersion: new SemVer("1.1.350"),
            command: nodeExecPath,
            args: flags,
        });

        mockedFs.readFileSync.mockImplementation(
            ((p) => {
                expect(p).toBe("pyrightconfig.json");
                return configJSON;
            }) as typeof fs.readFileSync,
        );

        mockedFs.existsSync.mockImplementation((p) => {
            expect(p).toBe("pyrightconfig.json");
            return true;
        });

        await main();
    });

    test("implicit pyrightconfig.json 1.1.351", async () => {
        mockedHelpers.getArgs.mockResolvedValue({
            annotate: new Set(),
            workingDirectory: wd,
            pyrightVersion: new SemVer("1.1.351"),
            command: nodeExecPath,
            args: flags,
        });

        mockedFs.readFileSync.mockImplementation(
            ((p) => {
                expect(p).toBe("pyrightconfig.json");
                return configJSON;
            }) as typeof fs.readFileSync,
        );

        mockedFs.existsSync.mockImplementation((p) => {
            expect(p).toBe("pyrightconfig.json");
            return true;
        });

        await main();
    });

    test("implicit pyrightconfig.json 1.1.352", async () => {
        mockedHelpers.getArgs.mockResolvedValue({
            annotate: new Set(),
            workingDirectory: wd,
            pyrightVersion: new SemVer("1.1.352"),
            command: nodeExecPath,
            args: flags,
        });

        mockedFs.readFileSync.mockImplementation(
            ((p) => {
                expect(p).toBe("pyrightconfig.json");
                return configJSON;
            }) as typeof fs.readFileSync,
        );

        mockedFs.existsSync.mockImplementation((p) => {
            expect(p).toBe("pyrightconfig.json");
            return true;
        });

        await main();
    });

    test("implicit pyrightconfig.json 1.1.353", async () => {
        mockedHelpers.getArgs.mockResolvedValue({
            annotate: new Set(),
            workingDirectory: wd,
            pyrightVersion: new SemVer("1.1.353"),
            command: nodeExecPath,
            args: flags,
        });

        mockedFs.readFileSync.mockImplementation(
            ((p) => {
                expect(p).toBe("pyrightconfig.json");
                return configJSON;
            }) as typeof fs.readFileSync,
        );

        mockedFs.existsSync.mockImplementation((p) => {
            expect(p).toBe("pyrightconfig.json");
            return true;
        });

        await main();
    });

    test("explicit pyrightconfig.json", async () => {
        mockedHelpers.getArgs.mockResolvedValue({
            annotate: new Set(),
            workingDirectory: wd,
            pyrightVersion,
            command: nodeExecPath,
            args: [...flags, "--project", "/some/path/to/pyrightconfig.json"],
        });

        mockedFs.readFileSync.mockImplementation(
            ((p) => {
                expect(p).toBe("/some/path/to/pyrightconfig.json");
                return configJSON;
            }) as typeof fs.readFileSync,
        );

        mockedFs.existsSync.mockImplementation((p) => {
            expect(p).toBe("/some/path/to/pyrightconfig.json");
            return true;
        });

        await main();
    });

    test("explicit pyrightconfig.json directory", async () => {
        mockedHelpers.getArgs.mockResolvedValue({
            annotate: new Set(),
            workingDirectory: wd,
            pyrightVersion,
            command: nodeExecPath,
            args: [...flags, "--project", "/some/path/to"],
        });

        mockedFs.readFileSync.mockImplementation(
            ((p) => {
                expect(p).toBe("/some/path/to/pyrightconfig.json");
                return configJSON;
            }) as typeof fs.readFileSync,
        );

        mockedFs.existsSync.mockImplementation((p) => {
            expect(p).toBe("/some/path/to/pyrightconfig.json");
            return true;
        });

        await main();
    });

    test("explicit pyrightconfig.json bad json", async () => {
        mockedHelpers.getArgs.mockResolvedValue({
            annotate: new Set(),
            workingDirectory: wd,
            pyrightVersion,
            command: nodeExecPath,
            args: [...flags, "--project", "/some/path/to/pyrightconfig.json"],
        });

        mockedFs.readFileSync.mockImplementation(
            ((p) => {
                expect(p).toBe("/some/path/to/pyrightconfig.json");
                return "this is not JSON";
            }) as typeof fs.readFileSync,
        );

        mockedFs.existsSync.mockImplementation((p) => {
            expect(p).toBe("/some/path/to/pyrightconfig.json");
            return true;
        });

        await main();
    });

    test("pyproject.toml", async () => {
        mockedHelpers.getArgs.mockResolvedValue({
            annotate: new Set(),
            workingDirectory: wd,
            pyrightVersion,
            command: nodeExecPath,
            args: flags,
        });

        mockedFs.readFileSync.mockImplementation(
            ((p) => {
                expect(p).toBe("/some/wd/pyproject.toml");
                return configToml;
            }) as typeof fs.readFileSync,
        );

        mockedFs.existsSync.mockImplementation((p) => {
            switch (p) {
                case "pyrightconfig.json":
                    return false;
                case "/some/wd/is/deep/pyproject.toml":
                    return false;
                case "/some/wd/is/pyproject.toml":
                    return false;
                case "/some/wd/pyproject.toml":
                    return true;
                default:
                    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                    throw new Error(`unexpected path: ${p}`);
            }
        });

        await main();
    });

    test("pyproject.toml bad toml", async () => {
        mockedHelpers.getArgs.mockResolvedValue({
            annotate: new Set(),
            workingDirectory: wd,
            pyrightVersion,
            command: nodeExecPath,
            args: flags,
        });

        mockedFs.readFileSync.mockImplementation(
            ((p) => {
                expect(p).toBe("/some/wd/pyproject.toml");
                return "this is not toml";
            }) as typeof fs.readFileSync,
        );

        mockedFs.existsSync.mockImplementation((p) => {
            switch (p) {
                case "pyrightconfig.json":
                    return false;
                case "/some/wd/is/deep/pyproject.toml":
                    return false;
                case "/some/wd/is/pyproject.toml":
                    return false;
                case "/some/wd/pyproject.toml":
                    return true;
                default:
                    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                    throw new Error(`unexpected path: ${p}`);
            }
        });

        await main();
    });
});

function reportToString(report: Report): string {
    return JSON.stringify(report);
}
