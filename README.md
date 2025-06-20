# pyright-action

[![ci](https://github.com/jakebailey/pyright-action/actions/workflows/ci.yml/badge.svg)](https://github.com/jakebailey/pyright-action/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/jakebailey/pyright-action/branch/main/graph/badge.svg?token=5OMEFS2LQZ)](https://codecov.io/gh/jakebailey/pyright-action)

GitHub action for [pyright](https://github.com/microsoft/pyright). Featuring:

- PR/commit annotations for errors/warnings.
- **NEW in v3**: Performance monitoring with stats budget enforcement.
- **NEW in v3**: Type coverage verification with customizable thresholds.
- **NEW in v3**: SARIF output for GitHub Security tab integration.
- **NEW in v3**: PR comments for slow files and coverage reports.
- Super fast startup, via:
  - Download caching.
  - No dependency on `setup-node`.

## Basic Usage

```yml
- uses: jakebailey/pyright-action@v3
  with:
    version: 1.1.311 # Optional (change me!)
```

## v3 New Features

Pyright Action v3 introduces several powerful new features for advanced type
checking workflows:

### Stats Budget

Monitor and enforce performance budgets for type checking:

```yml
- uses: jakebailey/pyright-action@v3
  with:
    stats-budget-ms: 5000 # Fail if any file takes >5s to analyze
    stats-top: 10 # Show top 10 slowest files in comments
    comment-slow: true # Post PR comments for slow files
```

### Verify Types Threshold

Set minimum type completeness requirements:

```yml
- uses: jakebailey/pyright-action@v3
  with:
    verify-types: mypackage
    verify-threshold: 95.0 # Require 95% type completeness
    comment-coverage: true # Post coverage summary in PR
```

### SARIF Integration

Generate SARIF files for GitHub's security tab:

```yml
- uses: jakebailey/pyright-action@v3
  with:
    sarif: true # Generate and upload SARIF file
```

### Complete v3 Example

```yml
- uses: jakebailey/pyright-action@v3
  with:
    version: latest
    stats-budget-ms: 3000
    stats-top: 5
    verify-types: mylib
    verify-threshold: 90.0
    sarif: true
    comment-slow: true
    comment-coverage: true
```

## Options

```yml
inputs:
  # Options for pyright-action
  version:
    description: 'Version of pyright to run, or "PATH" to use pyright from $PATH. If neither version nor pylance-version are specified, the latest version will be used.'
    required: false
  pylance-version:
    description: 'Version of pylance whose pyright version should be run. Can be latest-release, latest-prerelease, or a specific pylance version. Ignored if version option is specified.'
    required: false
  working-directory:
    description: 'Directory to run pyright in. If not specified, the repo root will be used.'
    required: false
  annotate:
    description: 'A comma separated list of check annotations to emit. May be "none"/"false", "errors", "warnings", or "all"/"true" (shorthand for "errors, warnings").'
    required: false
    default: 'all'

  # Shorthand for pyright flags
  create-stub:
    description: 'Create type stub file(s) for import. Note: using this option disables commenting.'
    required: false
  dependencies:
    description: 'Emit import dependency information. Note: using this option disables commenting.'
    required: false
  ignore-external:
    description: 'Ignore external imports for verify-types.'
    required: false
  level:
    description: 'Minimum diagnostic level (error or warning)'
    required: false
  project:
    description: 'Use the configuration file at this location.'
    required: false
  python-platform:
    description: 'Analyze for a specific platform (Darwin, Linux, Windows).'
    required: false
  python-path:
    description: 'Path to the Python interpreter.'
    required: false
  python-version:
    description: 'Analyze for a specific version (3.3, 3.4, etc.).'
    required: false
  skip-unannotated:
    description: 'Skip analysis of functions with no type annotations.'
    required: false
  stats:
    description: 'Print detailed performance stats. Note: using this option disables commenting.'
    required: false
  typeshed-path:
    description: 'Use typeshed type stubs at this location.'
    required: false
  venv-path:
    description: 'Directory that contains virtual environments.'
    required: false
  verbose:
    description: 'Emit verbose diagnostics. Note: using this option disables commenting.'
    required: false
  verify-types:
    description: 'Package name to run the type verifier on; must be an *installed* library. Any score under 100% will fail the build. Using this option disables commenting.'
    required: false
  warnings:
    description: 'Use exit code of 1 if warnings are reported.'
    required: false
    default: 'false'

  # v3 New Features
  stats-budget-ms:
    description: 'Maximum allowed time in milliseconds for any single file analysis. Files exceeding this budget will cause the action to fail.'
    required: false
  stats-top:
    description: 'Number of slowest files to report in PR comments when using stats-budget-ms (default: 5).'
    required: false
    default: '5'
  verify-threshold:
    description: 'Minimum type completeness percentage required when using verify-types. Any score below this threshold will fail the build.'
    required: false
  sarif:
    description: 'Generate and upload SARIF file for GitHub security tab integration.'
    required: false
    default: 'false'
  comment-slow:
    description: 'Post PR comments showing slowest files when stats-budget-ms is exceeded.'
    required: false
    default: 'true'
  comment-coverage:
    description: 'Post PR comments showing type coverage summary when using verify-types.'
    required: false
    default: 'true'

  # Extra arguments (if what you want isn't listed above)
  extra-args:
    description: 'Extra arguments; can be used to specify specific files to check.'
    required: false

  # Removed in pyright 1.1.303
  lib:
    description: 'Use library code to infer types when stubs are missing.'
    required: false
    default: 'false'

  # Deprecated
  no-comments:
    description: 'Disable issue/commit comments.'
    required: false
    default: 'false'
    deprecationMessage: 'Use "annotate" instead.'
```

## Use with a virtualenv

The easiest way to use a virtualenv with this action is to "activate" the
environment by adding its bin to `$PATH`, then allowing `pyright` to find it
there.

```yml
- uses: actions/checkout@v3
- uses: actions/setup-python@v4
  with:
    cache: 'pip'

- run: |
    python -m venv .venv
    source .venv/bin/activate
    pip install -r requirements.txt

- run: echo "$PWD/.venv/bin" >> $GITHUB_PATH

- uses: jakebailey/pyright-action@v2
```

## Use with poetry

Similarly to a virtualenv, the easiest way to get it working is to ensure that
poetry's python binary is on `$PATH`:

```yml
- uses: actions/checkout@v3

- run: pipx install poetry
- uses: actions/setup-python@v4
  with:
    cache: 'poetry'

- run: poetry install
- run: echo "$(poetry env info --path)/bin" >> $GITHUB_PATH

- uses: jakebailey/pyright-action@v2
```

## Providing a pyright version sourced from preexisting dependencies

The `version` input only accepts "latest" or a specific version number. However,
there are many ways to use specify a version of `pyright` derived from other
tools.

### Using pyright from `$PATH`

If you have `pyright` installed in your environment, e.g. via the `pyright` PyPI
package, specify `version: PATH` to use the version that's on `$PATH`.

```yml
- run: |
    python -m venv .venv
    source .venv/bin/activate
    pip install -r dev-requirements.txt # includes pyright

- run: echo "$PWD/.venv/bin" >> $GITHUB_PATH

- uses: jakebailey/pyright-action@v2
  with:
    version: PATH
```

### Keeping Pyright and Pylance in sync

If you use Pylance as your language server, you'll likely want pyright-action to
use the same version of `pyright` that Pylance does. The `pylance-version`
option makes this easy.

If you allow VS Code to auto-update Pylance, then set `pylance-version` to
`latest-release` if you use Pylance's Release builds, or `latest-prerelease` if
you use Pylance's Pre-Release builds. Alternatively, you can set it to a
particular Pylance version number (ex. `2023.11.11`).

Note that the `version` option takes precedence over `pylance-version`, so
you'll want to set one or the other, not both.

```yml
- uses: jakebailey/pyright-action@v2
  with:
    pylance-version: latest-release
```
