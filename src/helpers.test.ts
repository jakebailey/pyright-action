import * as core from '@actions/core';
import * as httpClient from '@actions/http-client';
import * as tc from '@actions/tool-cache';

jest.mock('@actions/core');
const mockedCore = jest.mocked(core);
jest.mock('@actions/http-client');
const mockedHttpClient = jest.mocked(httpClient);
jest.mock('@actions/tool-cache');
const mockedTc = jest.mocked(tc);

import { getArgs } from './helpers';

beforeEach(() => {
    jest.clearAllMocks();
});

test('boolean input', () => {});
