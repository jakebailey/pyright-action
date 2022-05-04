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
                pyrightVersion: new SemVer(pyrightVersion),
                args: args,
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
                pyrightVersion: new SemVer('1.1.240'),
                args: args,
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
});
