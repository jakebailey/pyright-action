import * as core from '@actions/core';
import * as httpClient from '@actions/http-client';
import * as tc from '@actions/tool-cache';
import type { IncomingMessage } from 'http';
import serializer from 'jest-serializer-path';
import * as os from 'os';
import * as path from 'path';

expect.addSnapshotSerializer(serializer);

jest.mock('@actions/core');
const mockedCore = jest.mocked(core);
jest.mock('@actions/http-client');
const mockedHttpClient = jest.mocked(httpClient, true);
jest.mock('@actions/tool-cache');
const mockedTc = jest.mocked(tc);

import { version as actionVersion } from '../package.json';
import { getActionVersion, getArgs, getNodeInfo } from './helpers';
import { NpmRegistryResponse } from './schema';

const fakeRoot = path.join(os.tmpdir(), 'rootDir');

beforeEach(() => {
    jest.clearAllMocks();
    mockedTc.find.mockReturnValue('');
    mockedTc.cacheDir.mockImplementation(async (dir) => path.join(fakeRoot, 'cached', path.relative(fakeRoot, dir)));
});

afterEach(() => {
    expect(mockedCore.getInput.mock.calls).toMatchSnapshot('core.getInput');
    expect(mockedTc.downloadTool.mock.calls).toMatchSnapshot('tc.downloadTool');
    expect(mockedTc.extractTar.mock.calls).toMatchSnapshot('tc.extractTar');
    expect(mockedTc.find.mock.calls).toMatchSnapshot('tc.find');
    expect(mockedTc.cacheDir.mock.calls).toMatchSnapshot('tc.cacheDir');
});

describe('getArgs', () => {
    test('bad version', async () => {
        mockedCore.getInput.mockImplementation((name, options) => {
            expect(options).toBeUndefined();
            switch (name) {
                case 'version':
                    return 'this is not a semver';
                default:
                    return '';
            }
        });

        await expect(getArgs()).rejects.toThrowError('not a semver');
    });

    describe('valid version', () => {
        const npmResponse: NpmRegistryResponse = {
            version: '1.1.240',
            dist: {
                tarball: 'https://registry.npmjs.org/pyright/-/pyright-1.1.240.tgz',
            },
        };
        const tarballPath = path.join(fakeRoot, 'pyright.tar.gz');
        const extractedPath = path.join(fakeRoot, 'pyright');

        const inputs = new Map<string, string>();

        beforeEach(() => {
            inputs.clear();

            mockedCore.getInput.mockImplementation((name, options) => {
                expect(options).toBeUndefined();
                return inputs.get(name) ?? '';
            });

            mockedHttpClient.HttpClient.prototype.get.mockImplementation(async (url) => {
                switch (url) {
                    case `https://registry.npmjs.org/pyright/${npmResponse.version}`:
                    case 'https://registry.npmjs.org/pyright/latest':
                        return {
                            message: {
                                statusCode: 200,
                            } as IncomingMessage,
                            readBody: async () => JSON.stringify(npmResponse),
                        };
                    case `https://registry.npmjs.org/pyright/1.1.404`:
                        return {
                            message: {
                                statusCode: 404,
                            } as IncomingMessage,
                            readBody: async () => JSON.stringify('version not found: 1.1.404'),
                        };
                    default:
                        throw new Error(`unknown URL ${url}`);
                }
            });

            mockedTc.downloadTool.mockResolvedValue(tarballPath);
            mockedTc.extractTar.mockResolvedValue(extractedPath);
        });

        test('many options', async () => {
            inputs.set('working-directory', '/path/to/project');
            inputs.set('python-platform', 'Linux');
            inputs.set('python-version', '3.9');
            inputs.set('typeshed-path', '/path/to/typeshed');
            inputs.set('venv-path', '/path/to-venv');
            inputs.set('project', '/path/to/pyrightconfig.json');
            inputs.set('lib', 'True');
            inputs.set('warnings', 'TrUe');
            inputs.set('extra-args', '--foo --bar --baz');

            const result = await getArgs();
            expect(result).toMatchSnapshot('result');

            expect(mockedTc.downloadTool).toBeCalledWith(npmResponse.dist.tarball);
            expect(mockedTc.extractTar).toBeCalledWith(tarballPath);
        });

        test('no comments', async () => {
            inputs.set('no-comments', 'true');

            const result = await getArgs();
            expect(result).toMatchSnapshot('result');
        });

        test('verifytypes', async () => {
            inputs.set('verify-types', 'some.package');

            const result = await getArgs();
            expect(result).toMatchSnapshot('result');
        });

        test('version not found', async () => {
            inputs.set('version', '1.1.404');
            await expect(getArgs()).rejects.toThrowError('version not found: 1.1.404');
        });

        test('cached', async () => {
            mockedTc.find.mockReturnValue(path.join(fakeRoot, 'cached', 'pyright'));

            const result = await getArgs();
            expect(result).toMatchSnapshot('result');
            expect(mockedTc.cacheDir).toBeCalledTimes(0);
        });
    });
});

test('getNodeInfo', () => {
    const info = getNodeInfo();
    expect(info).toEqual({
        version: process.version,
        execPath: process.execPath,
    });
});

test('getActionVersion', () => {
    const version = getActionVersion();
    expect(version).toEqual(actionVersion);
});
