import * as core from '@actions/core';
import * as command from '@actions/core/lib/command';
import * as cp from 'child_process';
import SemVer from 'semver/classes/semver';

import { version as actionVersion } from '../package.json';
import * as helpers from './helpers';

const nodeVersion = 'v16.14.2';
const nodeExecPath = '/path/to/node';
const pyrightVersion = '1.1.240';

jest.mock('@actions/core');
const mockedCore = jest.mocked(core);
jest.mock('@actions/core/lib/command');
const mockedCommand = jest.mocked(command);
jest.mock('child_process');
const mockedCp = jest.mocked(cp);
jest.mock('./helpers');
const mockedHelpers = jest.mocked(helpers);

const mockedProcessChdir = jest.spyOn(process, 'chdir');

import { main } from './main';
import { Report } from './schema';

beforeEach(() => {
    jest.clearAllMocks();
    mockedHelpers.getNodeInfo.mockReturnValue({
        version: nodeVersion,
        execPath: nodeExecPath,
    });
    mockedProcessChdir.mockReturnValue(undefined);
});

test('thrown error at first call', async () => {
    mockedHelpers.getNodeInfo.mockImplementation(() => {
        throw new Error('oops');
    });

    await main();

    expect(mockedCore.setFailed).toBeCalledWith('oops');
});

describe('no comments', () => {
    const args = ['/path/to/pyright/dist/index.js', '--outputjson'];
    const wd = '/some/wd';

    beforeEach(() => {
        mockedHelpers.getArgs.mockImplementation(async () => {
            return {
                noComments: true,
                workingDirectory: wd,
                pyrightVersion,
                args,
            };
        });
    });

    test('success', async () => {
        mockedCp.spawnSync.mockImplementation(() => ({
            pid: -1,
            output: [],
            stdout: '',
            stderr: '',
            status: 0,
            signal: null,
        }));

        await main();

        expect(mockedCore.info.mock.calls).toEqual([
            [`pyright ${pyrightVersion}, node ${nodeVersion}, pyright-action ${actionVersion}`],
            [[nodeExecPath, ...args].join(' ')],
        ]);

        expect(mockedProcessChdir).toBeCalledWith(wd);
        expect(mockedCore.setFailed).toBeCalledTimes(0);
    });

    test('failure', async () => {
        mockedCp.spawnSync.mockImplementation(() => ({
            pid: -1,
            output: [],
            stdout: '',
            stderr: '',
            status: 1,
            signal: null,
        }));

        await main();

        expect(mockedProcessChdir).toBeCalledWith(wd);
        expect(mockedCp.spawnSync).toHaveBeenCalledWith(nodeExecPath, args, {
            stdio: ['ignore', 'inherit', 'inherit'],
        });
        expect(mockedCore.setFailed).toHaveBeenCalledWith('Exit code 1');
    });
});

describe('with comments', () => {
    const args = ['/path/to/pyright/dist/index.js', '--outputjson'];

    beforeEach(() => {
        mockedHelpers.getArgs.mockImplementation(async () => {
            return {
                noComments: false,
                workingDirectory: '',
                pyrightVersion,
                args,
            };
        });
    });

    test('failure', async () => {
        mockedCp.spawnSync.mockImplementation(() => ({
            pid: -1,
            output: [],
            stdout: '',
            stderr: '',
            status: 2,
            signal: null,
        }));

        await main();

        expect(mockedCp.spawnSync).toHaveBeenCalledWith(nodeExecPath, args, {
            encoding: 'utf-8',
            stdio: ['ignore', 'pipe', 'inherit'],
        });
        expect(mockedCore.setFailed).toHaveBeenCalledWith('Exit code 2');
    });

    test('unparsable json', async () => {
        mockedCp.spawnSync.mockImplementation(() => ({
            pid: -1,
            output: [],
            stdout: '}',
            stderr: '',
            status: 0,
            signal: null,
        }));

        await main();

        expect(mockedCore.setFailed).toBeCalledTimes(1);
        expect(mockedCore.setFailed.mock.calls[0][0]).toMatch('Unexpected token');
    });

    test('invalid stdout', async () => {
        mockedCp.spawnSync.mockImplementation(() => ({
            pid: -1,
            output: [],
            stdout: '{}',
            stderr: '',
            status: 0,
            signal: null,
        }));

        await main();

        expect(mockedCore.setFailed).toBeCalledTimes(1);
        expect(mockedCore.setFailed.mock.calls[0][0]).toMatch('error parsing object');
    });

    test('no diagnostics', async () => {
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
            }),
            stderr: '',
            status: 0,
            signal: null,
        }));

        await main();

        expect(mockedCore.setFailed).toBeCalledTimes(0);
        expect(mockedCore.info.mock.calls).toEqual([
            [`pyright ${pyrightVersion}, node ${nodeVersion}, pyright-action ${actionVersion}`],
            [[nodeExecPath, ...args].join(' ')],
            ['0 errors, 0 warnings, 0 infos'],
        ]);
    });

    test('with diagnostics', async () => {
        mockedCp.spawnSync.mockImplementation(() => ({
            pid: -1,
            output: [],
            stdout: reportToString({
                generalDiagnostics: [
                    {
                        file: '/path/to/file1.py',
                        range: { start: { line: 0, character: 0 }, end: { line: 1, character: 1 } },
                        severity: 'error',
                        message: 'some error',
                    },
                    {
                        file: '/path/to/file2.py',
                        range: { start: { line: 0, character: 0 }, end: { line: 0, character: 0 } },
                        severity: 'warning',
                        message: 'some warning',
                    },
                    {
                        file: '/path/to/file3.py',
                        range: { start: { line: 0, character: 0 }, end: { line: 1, character: 1 } },
                        severity: 'information',
                        message: 'some info',
                        rule: 'reportSomeInformation',
                    },
                    {
                        file: '/path/to/file3.py',
                        severity: 'warning',
                        message: 'another warning',
                        rule: 'reportSomeWarning',
                    },
                    {
                        file: '/path/to/file1.py',
                        range: { start: { line: 5, character: 9 }, end: { line: 5, character: 15 } },
                        severity: 'error',
                        message: 'some error',
                    },
                ],
                summary: {
                    errorCount: 2,
                    warningCount: 2,
                    informationCount: 1,
                },
            }),
            stderr: '',
            status: 1,
            signal: null,
        }));

        await main();

        expect(mockedCommand.issueCommand.mock.calls).toEqual([
            ['error', { file: '/path/to/file1.py', line: 1, col: 1 }, 'some error'],
            ['warning', { file: '/path/to/file2.py', line: 1, col: 1 }, 'some warning'],
            ['warning', { file: '/path/to/file3.py', line: 1, col: 1 }, 'another warning (reportSomeWarning)'],
            ['error', { file: '/path/to/file1.py', line: 6, col: 10 }, 'some error'],
        ]);

        expect(mockedCore.info.mock.calls).toEqual([
            [`pyright ${pyrightVersion}, node ${nodeVersion}, pyright-action ${actionVersion}`],
            [[nodeExecPath, ...args].join(' ')],
            ['/path/to/file1.py:1:1 - error: some error'],
            ['/path/to/file2.py:warning: some warning'],
            ['/path/to/file3.py:1:1 - information: some info (reportSomeInformation)'],
            ['/path/to/file3.py:warning: another warning (reportSomeWarning)'],
            ['/path/to/file1.py:6:10 - error: some error'],
            ['2 errors, 2 warnings, 1 info'],
        ]);
        expect(mockedCore.setFailed).toBeCalledWith('2 errors');
    });

    test('with 1 each', async () => {
        mockedCp.spawnSync.mockImplementation(() => ({
            pid: -1,
            output: [],
            stdout: reportToString({
                generalDiagnostics: [
                    {
                        file: '/path/to/file1.py',
                        range: { start: { line: 0, character: 0 }, end: { line: 1, character: 1 } },
                        severity: 'error',
                        message: 'some error',
                    },
                    {
                        file: '/path/to/file2.py',
                        range: { start: { line: 0, character: 0 }, end: { line: 0, character: 0 } },
                        severity: 'warning',
                        message: 'some warning',
                    },
                    {
                        file: '/path/to/file3.py',
                        range: { start: { line: 0, character: 0 }, end: { line: 1, character: 1 } },
                        severity: 'information',
                        message: 'some info',
                        rule: 'reportSomeInformation',
                    },
                ],
                summary: {
                    errorCount: 1,
                    warningCount: 1,
                    informationCount: 1,
                },
            }),
            stderr: '',
            status: 1,
            signal: null,
        }));

        await main();

        expect(mockedCore.info.mock.calls).toEqual([
            [`pyright ${pyrightVersion}, node ${nodeVersion}, pyright-action ${actionVersion}`],
            [[nodeExecPath, ...args].join(' ')],
            ['/path/to/file1.py:1:1 - error: some error'],
            ['/path/to/file2.py:warning: some warning'],
            ['/path/to/file3.py:1:1 - information: some info (reportSomeInformation)'],
            ['1 error, 1 warning, 1 info'],
        ]);
        expect(mockedCore.setFailed).toBeCalledWith('1 error');
    });
});

function reportToString(report: Report): string {
    return JSON.stringify(report);
}
