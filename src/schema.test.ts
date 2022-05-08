import clone from 'clone';

import { parseNpmRegistryResponse, parseReport } from './schema';

describe('parseReport', () => {
    const realPyrightOutput = {
        version: '1.1.245',
        time: '1652047358157',
        generalDiagnostics: [
            {
                file: '/home/jake/work/python/typeshed/stubs/cryptography/cryptography/x509/__init__.pyi',
                severity: 'error',
                message: '"X509Backend" is unknown import symbol',
                range: {
                    start: {
                        line: 8,
                        character: 52,
                    },
                    end: {
                        line: 8,
                        character: 63,
                    },
                },
                rule: 'reportGeneralTypeIssues',
            },
        ],
        summary: {
            filesAnalyzed: 2704,
            errorCount: 1,
            warningCount: 0,
            informationCount: 0,
            timeInSec: 7.342,
        },
    };

    test('good', () => {
        const report = parseReport(realPyrightOutput);
        expect(report).toMatchSnapshot('report');
    });

    test('missing key', () => {
        const badOutput = clone(realPyrightOutput);
        delete (badOutput as any).generalDiagnostics;
        expect(() => parseReport(badOutput)).toThrowError('error parsing object');
    });
});

describe('parseNpmRegistryResponse', () => {
    const realResponse = {
        name: 'pyright',
        displayName: 'Pyright',
        description: 'Type checker for the Python language',
        version: '1.1.245',
        license: 'MIT',
        author: { name: 'Microsoft Corporation' },
        publisher: 'Microsoft Corporation',
        engines: { node: '>=12.0.0' },
        repository: { type: 'git', url: 'git+https://github.com/Microsoft/pyright.git', directory: 'packages/pyright' },
        scripts: {
            build: 'webpack --mode production --progress',
            clean: 'shx rm -rf ./dist ./out README.md LICENSE.txt',
            prepack: 'npm run clean && shx cp ../../README.md . && shx cp ../../LICENSE.txt . && npm run build',
            webpack: 'webpack --mode development --progress',
        },
        devDependencies: {
            '@types/copy-webpack-plugin': '^10.1.0',
            '@types/node': '^17.0.14',
            'copy-webpack-plugin': '^10.2.4',
            'esbuild-loader': '^2.18.0',
            shx: '^0.3.4',
            'ts-loader': '^9.2.6',
            typescript: '~4.4.4',
            webpack: '^5.68.0',
            'webpack-cli': '^4.9.2',
        },
        main: 'index.js',
        bin: { pyright: 'index.js', 'pyright-langserver': 'langserver.index.js' },
        bugs: { url: 'https://github.com/Microsoft/pyright/issues' },
        homepage: 'https://github.com/Microsoft/pyright#readme',
        _id: 'pyright@1.1.245',
        _nodeVersion: '14.19.0',
        _npmVersion: '6.14.16',
        dist: {
            integrity:
                'sha512-Q+AJRKqL4iklRgfv5NKHu/74woduTzO7VbRTkgJrPlopdOwEZPhD0La01HRR2LzGoDbWPJ2bWiSBqi7HSlM4Gw==',
            shasum: 'fde6d847002bbe0cb34edf035085aaeec6537867',
            tarball: 'https://registry.npmjs.org/pyright/-/pyright-1.1.245.tgz',
            fileCount: 2791,
            unpackedSize: 9084811,
            signatures: [
                {
                    keyid: 'SHA256:jl3bwswu80PjjokCgh0o2w5c2U4LhQAE57gj9cz1kzA',
                    sig: 'MEUCIEy5mhXHuNn3k7cCD5wOdb9I+1SH/xBz0OUkoERdM2PhAiEAqB4s+c52f1cVJGpe0J/vMmPUG03zN9KGerO99p47fH0=',
                },
            ],
            'npm-signature':
                '-----BEGIN PGP SIGNATURE-----\r\nVersion: OpenPGP.js v4.10.10\r\nComment: https://openpgpjs.org\r\n\r\nwsFzBAEBCAAGBQJidio6ACEJED1NWxICdlZqFiEECWMYAoorWMhJKdjhPU1b\r\nEgJ2Vmqz6A/+IRI69GbWI3bWoBl6zbT6/mNCcuYTV8swUquY3ay4Mc8EAaeh\r\n7UBkZ73G3fOMqoReFWDxQBB7qgdBpY6nZKZ131q+Ft8Eonnzr0oQByZQlc/P\r\n+QIpncJOChhqHt44nsf6YrWe7lgvR5hnAydqKNmsJFYimCuSxT2fVLr2MElB\r\nrzyEJOc9EtTkooRCvBmRwXcuN4S5zOpxSmz6hyE0YP/3ZdHUR3nk1TTKTBVa\r\n5HmAak9/gOw2fKehWkkt8Ch6+f+so5cNlaA5w36Og3IAu2olITzWqtNlakbs\r\nnWul6fkwEFmWpy7rDCfYeJeLE0IwtTHmJyAc+WPbLLlTJAmhss0Rb5wSfFbR\r\nFA6n5/RFRiaF/7oDkabbk0u2DXIGNnOSYWnVY/38JaomLROuEw9Y1/+5e1Re\r\nKteRwsIk+JMmYK0NWNxFATdUQ6w7XpymqIxcMW6KBn0ZgTn6PUB5wyg0ZKtU\r\n0HlO9PwV8D6UumoRgMzBLro7/y7QN5ZB5+WVKpdolkLd7upuqWlSXRCJ/xez\r\n7nkfF8I8Ve0r5ytkZBZgaQJ0Bxt2QdYoB7vFZRQXv7IQjDZZKl2HwuG+XRLn\r\nVOHj8QWm8V/72ZaGCv00UQ/Ih1ZhqGACmNI9XgLsitHpPz1PWUt8ogNVvvwV\r\nJhJbezkZ1KH0tDrZz1SPqK+WPriUMicfs0c=\r\n=lVm1\r\n-----END PGP SIGNATURE-----\r\n',
        },
        _npmUser: { name: 'erictraut', email: 'erictr@microsoft.com' },
        directories: {},
        maintainers: [
            { name: 'erictraut', email: 'erictr@microsoft.com' },
            { name: 'jakebailey', email: 'jacob.b.bailey@gmail.com' },
        ],
        _npmOperationalInternal: {
            host: 's3://npm-registry-packages',
            tmp: 'tmp/pyright_1.1.245_1651911225991_0.6843080470262419',
        },
        _hasShrinkwrap: false,
    };

    test('good', () => {
        const response = parseNpmRegistryResponse(realResponse);
        expect(response).toMatchSnapshot('response');
    });

    test('missing key', () => {
        const badOutput = clone(realResponse);
        delete (badOutput as any).dist;
        expect(() => parseNpmRegistryResponse(badOutput)).toThrowError('error parsing object');
    });

    test('not a version', () => {
        const badOutput = clone(realResponse);
        badOutput.version = 'oopsie';
        expect(() => parseNpmRegistryResponse(badOutput)).toThrowError('must be a semver');
    });
});
