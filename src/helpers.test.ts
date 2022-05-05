import * as core from '@actions/core';
import * as httpClient from '@actions/http-client';
import * as tc from '@actions/tool-cache';

jest.mock('@actions/core');
const mockedCore = jest.mocked(core);
jest.mock('@actions/http-client');
const mockedHttpClient = jest.mocked(httpClient);
jest.mock('@actions/tool-cache');
const mockedTc = jest.mocked(tc);

import { getArgs, getNodeInfo } from './helpers';

beforeEach(() => {
    jest.clearAllMocks();
});

describe('getArgs', () => {
    test('bad version', async () => {
        mockedCore.getInput.mockImplementation((name, options) => {
            switch (name) {
                case 'version':
                    expect(options).toBeUndefined();
                    return 'this is not a semver';
                default:
                    return '';
            }
        });

        expect(getArgs()).rejects.toThrowError('not a semver');
    });
});

test('getNodeInfo', () => {
    const info = getNodeInfo();
    expect(info).toEqual({
        version: process.version,
        execPath: process.execPath,
    });
});
