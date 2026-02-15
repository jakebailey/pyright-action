# pyright-action

[![ci](https://github.com/jakebailey/pyright-action/actions/workflows/ci.yml/badge.svg)](https://github.com/jakebailey/pyright-action/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/jakebailey/pyright-action/branch/main/graph/badge.svg?token=5OMEFS2LQZ)](https://codecov.io/gh/jakebailey/pyright-action)

GitHub action for [pyright](https://github.com/microsoft/pyright). Featuring:

- PR/commit annotations for errors/warnings.
- Super fast startup, via:
  - Download caching.
  - No dependency on `setup-node`.

```yml
- uses: jakebailey/pyright-action@v3
  with:
    version: 1.1.311 # Optional (change me!)
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
- uses: actions/setup-python@v6
  with:
    cache: 'pip'

- run: |
    python -m venv .venv
    source .venv/bin/activate
    pip install -r requirements.txt

- run: echo "$PWD/.venv/bin" >> $GITHUB_PATH

- uses: jakebailey/pyright-action@v3
```

## Use with poetry

Similarly to a virtualenv, the easiest way to get it working is to ensure that
poetry's python binary is on `$PATH`:

```yml
- uses: actions/checkout@v3

- run: pipx install poetry
- uses: actions/setup-python@v6
  with:
    cache: 'poetry'

- run: poetry install
- run: echo "$(poetry env info --path)/bin" >> $GITHUB_PATH

- uses: jakebailey/pyright-action@v3
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

- uses: jakebailey/pyright-action@v3
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
- uses: jakebailey/pyright-action@v3
  with:
    pylance-version: latest-release
```
