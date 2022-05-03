import * as core from '@actions/core';
import * as command from '@actions/core/lib/command';
import * as httpClient from '@actions/http-client';
import * as tc from '@actions/tool-cache';
import * as cp from 'child_process';

jest.mock('@actions/core');
const mockedCore = jest.mocked(core);
jest.mock('@actions/core/lib/command');
const mockedCommand = jest.mocked(command);
jest.mock('@actions/http-client');
const mockedHttpClient = jest.mocked(httpClient);
jest.mock('@actions/tool-cache');
const mockedTc = jest.mocked(tc);
jest.mock('child_process');
const mockedCp = jest.mocked(cp);

import { main } from './main';

beforeEach(() => {
    jest.clearAllMocks();
});

test('thrown error at first input call', () => {
    mockedCore.getInput.mockImplementation(() => {
        throw new Error('oopsie');
    });

    main();

    expect(mockedCore.setFailed.mock.calls).toHaveLength(1);
});
