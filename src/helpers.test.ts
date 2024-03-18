import type { IncomingMessage } from "node:http";
import * as os from "node:os";
import * as path from "node:path";

import * as core from "@actions/core";
import * as httpClient from "@actions/http-client";
import * as tc from "@actions/tool-cache";
import serializer from "jest-serializer-path";
import { afterEach, beforeEach, describe, expect, test, vitest } from "vitest";

expect.addSnapshotSerializer(serializer);

vitest.mock("@actions/core");
const mockedCore = vitest.mocked(core);
vitest.mock("@actions/http-client");
const mockedHttpClient = vitest.mocked(httpClient, true);
vitest.mock("@actions/tool-cache");
const mockedTc = vitest.mocked(tc);

import { version as actionVersion } from "../package.json";
import { getActionVersion, getArgs, getNodeInfo } from "./helpers";
import type { NpmRegistryResponse, PylanceBuildMetadata } from "./schema";

const fakeRoot = path.join(os.tmpdir(), "rootDir");

beforeEach(() => {
    vitest.clearAllMocks();
    mockedTc.find.mockReturnValue("");
    mockedTc.cacheDir.mockImplementation(async (dir) => path.join(fakeRoot, "cached", path.relative(fakeRoot, dir)));
});

afterEach(() => {
    expect([...mockedCore.getInput.mock.calls].sort()).toMatchSnapshot("core.getInput");
    expect(mockedTc.downloadTool.mock.calls).toMatchSnapshot("tc.downloadTool");
    expect(mockedTc.extractTar.mock.calls).toMatchSnapshot("tc.extractTar");
    expect(mockedTc.find.mock.calls).toMatchSnapshot("tc.find");
    expect(mockedTc.cacheDir.mock.calls).toMatchSnapshot("tc.cacheDir");
});

function getNpmResponse(version: string): NpmRegistryResponse {
    return {
        version,
        dist: {
            tarball: `https://registry.npmjs.org/pyright/-/pyright-${version}.tgz`,
        },
    };
}

function getPylanceMetadata(pylanceVersion: string, pyrightVersion: string): PylanceBuildMetadata {
    return {
        pylanceVersion,
        pyrightVersion,
    };
}

const latestPyright = "1.1.240";

describe("getArgs", () => {
    test("bad version", async () => {
        mockedCore.getInput.mockImplementation((name, options) => {
            expect(options).toBeUndefined();
            switch (name) {
                case "version":
                    return "this is not a semver";
                default:
                    return "";
            }
        });

        await expect(getArgs()).rejects.toThrowError("not a semver");
    });

    test("bad pylance-version", async () => {
        mockedCore.getInput.mockImplementation((name, options) => {
            expect(options).toBeUndefined();
            switch (name) {
                case "pylance-version":
                    return "this is not a semver";
                default:
                    return "";
            }
        });

        await expect(getArgs()).rejects.toThrowError("not a semver");
    });

    describe("valid version", () => {
        const tarballPath = path.join(fakeRoot, "pyright.tar.gz");
        const extractedPath = path.join(fakeRoot, "pyright");

        const inputs = new Map<string, string>();

        beforeEach(() => {
            inputs.clear();

            mockedCore.getInput.mockImplementation((name, options) => {
                expect(options).toBeUndefined();
                return inputs.get(name) ?? "";
            });

            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
            mockedHttpClient.HttpClient.prototype.get.mockImplementation(async (url: string) => {
                const versionPrefix = "https://registry.npmjs.org/pyright/";
                if (url.startsWith(versionPrefix)) {
                    const version = url.slice(versionPrefix.length);

                    switch (version) {
                        case "latest":
                            return {
                                message: {
                                    statusCode: 200,
                                } as IncomingMessage,
                                readBody: async () => JSON.stringify(getNpmResponse(latestPyright)),
                            };
                        case "999.999.404":
                            return {
                                message: {
                                    statusCode: 404,
                                } as IncomingMessage,
                                readBody: async () => JSON.stringify("version not found: 999.999.404"),
                            };
                        default:
                            return {
                                message: {
                                    statusCode: 200,
                                } as IncomingMessage,
                                readBody: async () => JSON.stringify(getNpmResponse(version)),
                            };
                    }
                }

                const pylanceVersionPrefix =
                    "https://raw.githubusercontent.com/microsoft/pylance-release/main/releases/";
                if (url.startsWith(pylanceVersionPrefix)) {
                    const pylanceVersion = url.slice(pylanceVersionPrefix.length, -5);

                    switch (pylanceVersion) {
                        case "9999.99.404":
                            return {
                                message: {
                                    statusCode: 404,
                                } as IncomingMessage,
                                readBody: async () => JSON.stringify("version not found: 9999.99.404"),
                            };
                        default:
                            return {
                                message: {
                                    statusCode: 200,
                                } as IncomingMessage,
                                readBody: async () => JSON.stringify(getPylanceMetadata(pylanceVersion, "9.9.999")),
                            };
                    }
                }

                throw new Error(`unknown URL ${url}`);
            });

            mockedTc.downloadTool.mockResolvedValue(tarballPath);
            mockedTc.extractTar.mockResolvedValue(extractedPath);
        });

        test("many options", async () => {
            inputs.set("working-directory", "/path/to/project");
            inputs.set("python-platform", "Linux");
            inputs.set("python-path", "/path/to/python");
            inputs.set("python-version", "3.9");
            inputs.set("typeshed-path", "/path/to/typeshed");
            inputs.set("venv-path", "/path/to-venv");
            inputs.set("project", "/path/to/pyrightconfig.json");
            inputs.set("lib", "True");
            inputs.set("warnings", "TrUe");
            inputs.set("extra-args", "--foo --bar --baz");
            inputs.set("level", "warning");

            const result = await getArgs();
            expect(result).toMatchSnapshot("result");

            expect(mockedTc.downloadTool).toBeCalledWith(getNpmResponse(latestPyright).dist.tarball);
            expect(mockedTc.extractTar).toBeCalledWith(tarballPath);
        });

        test("no comments", async () => {
            inputs.set("no-comments", "true");

            const result = await getArgs();
            expect(result).toMatchSnapshot("result");
        });

        test.each([
            "",
            "all",
            "none",
            "errors",
            "errors, warnings",
            "warnings",
            "warnings,errors",
            "true",
            "false",
            "True",
            "False",
        ])(
            "annotate %j",
            async (input) => {
                inputs.set("annotate", input);

                const result = await getArgs();
                expect(result).toMatchSnapshot("result");
            },
        );

        test("annotate invalid", async () => {
            inputs.set("annotate", "invalid");

            await expect(getArgs()).rejects.toThrowError('invalid value "invalid" for annotate');
        });

        test("annotate invalid comma", async () => {
            inputs.set("annotate", "errors,all");

            await expect(getArgs()).rejects.toThrowError('invalid value "all" in comma-separated annotate');
        });

        test("verifytypes", async () => {
            inputs.set("verify-types", "some.package");
            inputs.set("ignore-external", "true");

            const result = await getArgs();
            expect(result).toMatchSnapshot("result");
        });

        test("version not found", async () => {
            inputs.set("version", "999.999.404");
            await expect(getArgs()).rejects.toThrowError("version not found: 999.999.404");
        });

        test("cached", async () => {
            mockedTc.find.mockReturnValue(path.join(fakeRoot, "cached", "pyright"));

            const result = await getArgs();
            expect(result).toMatchSnapshot("result");
            expect(mockedTc.cacheDir).toBeCalledTimes(0);
        });

        test("extra-args quotes", async () => {
            inputs.set("extra-args", `--foo --bar --baz="quoted value"`);

            const result = await getArgs();
            expect(result).toMatchSnapshot("result");

            expect(mockedTc.downloadTool).toBeCalledWith(getNpmResponse(latestPyright).dist.tarball);
            expect(mockedTc.extractTar).toBeCalledWith(tarballPath);
        });

        test("extra-args malformed", async () => {
            inputs.set("extra-args", `--foo --bar --baz="quoted value" > /dev/null`);

            await expect(getArgs()).rejects.toThrowError(
                'malformed extra-args: --foo --bar --baz="quoted value" > /dev/null',
            );
        });

        test("verifytypes flag", async () => {
            inputs.set("extra-args", "--verifytypes");

            const result = await getArgs();
            expect(result).toMatchSnapshot("result");
        });

        test("verbose flag", async () => {
            inputs.set("extra-args", "--verbose");

            const result = await getArgs();
            expect(result).toMatchSnapshot("result");
        });

        test("verbose", async () => {
            inputs.set("verbose", "TRUE");

            const result = await getArgs();
            expect(result).toMatchSnapshot("result");
        });

        test("dependencies", async () => {
            inputs.set("dependencies", "TRUE");

            const result = await getArgs();
            expect(result).toMatchSnapshot("result");
        });

        test("createstub", async () => {
            inputs.set("create-stub", "pygame");

            const result = await getArgs();
            expect(result).toMatchSnapshot("result");
        });

        test("skip-unannotated", async () => {
            inputs.set("skip-unannotated", "TRUE");

            const result = await getArgs();
            expect(result).toMatchSnapshot("result");
        });

        test("stats", async () => {
            inputs.set("stats", "TRue");

            const result = await getArgs();
            expect(result).toMatchSnapshot("result");
        });

        test("1.1.308 dashes", async () => {
            const version = "1.1.308";
            inputs.set("version", version);
            inputs.set("typeshed-path", "/path/to/typeshed");
            inputs.set("venv-path", "/path/to-venv");

            const result = await getArgs();
            expect(result).toMatchSnapshot("result");

            expect(mockedTc.downloadTool).toBeCalledWith(getNpmResponse(version).dist.tarball);
            expect(mockedTc.extractTar).toBeCalledWith(tarballPath);
        });

        test("1.1.309 dashes", async () => {
            const version = "1.1.309";
            inputs.set("version", version);
            inputs.set("typeshed-path", "/path/to/typeshed");
            inputs.set("venv-path", "/path/to-venv");

            const result = await getArgs();
            expect(result).toMatchSnapshot("result");

            expect(mockedTc.downloadTool).toBeCalledWith(getNpmResponse(version).dist.tarball);
            expect(mockedTc.extractTar).toBeCalledWith(tarballPath);
        });

        test("1.1.310 dashes", async () => {
            const version = "1.1.310";
            inputs.set("version", version);
            inputs.set("typeshed-path", "/path/to/typeshed");
            inputs.set("venv-path", "/path/to-venv");

            const result = await getArgs();
            expect(result).toMatchSnapshot("result");

            expect(mockedTc.downloadTool).toBeCalledWith(getNpmResponse(version).dist.tarball);
            expect(mockedTc.extractTar).toBeCalledWith(tarballPath);
        });

        test("pylance-version not found", async () => {
            inputs.set("pylance-version", "9999.99.404");
            await expect(getArgs()).rejects.toThrowError("version not found: 9999.99.404");
        });

        test("pylance-version", async () => {
            const pylanceVersion = "2023.11.11";
            inputs.set("pylance-version", pylanceVersion);

            const result = await getArgs();
            expect(result).toMatchSnapshot("result");

            expect(mockedTc.downloadTool).toBeCalledWith(getNpmResponse("9.9.999").dist.tarball);
            expect(mockedTc.extractTar).toBeCalledWith(tarballPath);
        });

        test("version takes precedence over pylance-version", async () => {
            const version = "1.1.310";
            inputs.set("version", version);
            inputs.set("pylance-version", "2023.11.11");

            const result = await getArgs();
            expect(result).toMatchSnapshot("result");

            expect(mockedTc.downloadTool).toBeCalledWith(getNpmResponse(version).dist.tarball);
            expect(mockedTc.extractTar).toBeCalledWith(tarballPath);
        });
    });
});

test("getNodeInfo", () => {
    const info = getNodeInfo(process);
    expect(info).toEqual({
        version: process.version,
        execPath: process.execPath,
    });
});

test("getActionVersion", () => {
    const version = getActionVersion();
    expect(version).toEqual(actionVersion);
});
