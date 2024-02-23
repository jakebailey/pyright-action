/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable unicorn/no-null */
import * as cp from "node:child_process";

import * as core from "@actions/core";
import * as command from "@actions/core/lib/command";
import { afterEach, beforeEach, describe, expect, test, vitest } from "vitest";

import * as helpers from "./helpers";

const nodeVersion = "v20.8.1";
const nodeExecPath = "/path/to/node";
const pyrightVersion = "1.1.240";

vitest.mock("@actions/core");
const mockedCore = vitest.mocked(core);
vitest.mock("@actions/core/lib/command");
const mockedCommand = vitest.mocked(command);
vitest.mock("node:child_process");
const mockedCp = vitest.mocked(cp);
vitest.mock("./helpers");
const mockedHelpers = vitest.mocked(helpers);

const mockedProcessChdir = vitest.spyOn(process, "chdir");
const mockedProcessCwd = vitest.spyOn(process, "cwd");

let currentWorkingDirectory = "/some/default/cwd";

import { main } from "./main";
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
    expect(mockedCommand.issueCommand.mock.calls).toMatchSnapshot("command.issueCommand");
    expect(mockedCp.spawnSync.mock.calls).toMatchSnapshot("cp.spawnSync");
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
            noComments: true,
            workingDirectory: wd,
            pyrightVersion,
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
            noComments: false,
            workingDirectory: "",
            pyrightVersion,
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

function reportToString(report: Report): string {
    return JSON.stringify(report);
}
