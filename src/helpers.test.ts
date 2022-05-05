import * as core from '@actions/core';
import * as httpClient from '@actions/http-client';
import * as tc from '@actions/tool-cache';

jest.mock('@actions/core');
const mockedCore = jest.mocked(core);
jest.mock('@actions/http-client');
const mockedHttpClient = jest.mocked(httpClient, true);
jest.mock('@actions/tool-cache');
const mockedTc = jest.mocked(tc);

import { getArgs, getNodeInfo } from './helpers';
import { NpmRegistryResponse } from './schema';

const mockedHttpClientResponse = httpClient.HttpClientResponse as jest.MockedClass<
    typeof httpClient.HttpClientResponse
>;

beforeEach(() => {
    jest.clearAllMocks();
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

        expect(getArgs()).rejects.toThrowError('not a semver');
    });

    describe('ok', () => {
        const npmResponse: NpmRegistryResponse = {
            version: '1.1.240',
        };
        const tarballPath = '/path/to/pyright.tar.gz';
        const extractedPath = '/path/to/pyright';

        const inputs = new Map<string, string>();

        beforeEach(() => {
            inputs.clear();

            mockedCore.getInput.mockImplementation((name, options) => {
                expect(options).toBeUndefined();
                return inputs.get(name) ?? '';
            });

            mockedHttpClient.HttpClient.prototype.get.mockImplementation(async () => {
                return {
                    message: undefined as any,
                    readBody: async () => JSON.stringify(npmResponse),
                };
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

            expect(mockedTc.downloadTool).toBeCalledWith(
                `https://registry.npmjs.org/pyright/-/pyright-${npmResponse.version}.tgz`
            );
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
    });
});

test('getNodeInfo', () => {
    const info = getNodeInfo();
    expect(info).toEqual({
        version: process.version,
        execPath: process.execPath,
    });
});
