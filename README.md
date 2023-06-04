# pyright-action

[![ci](https://github.com/jakebailey/pyright-action/actions/workflows/ci.yml/badge.svg)](https://github.com/jakebailey/pyright-action/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/jakebailey/pyright-action/branch/main/graph/badge.svg?token=5OMEFS2LQZ)](https://codecov.io/gh/jakebailey/pyright-action)

GitHub action for [pyright](https://github.com/microsoft/pyright).

```yml
- uses: jakebailey/pyright-action@v1
  with:
    version: 1.1.311 # Optional (change me!)
```

## Options

```yml
inputs:
  # Options for pyright-action
  version:
    description: "Version of pyright to run. If not specified, the latest version will be used."
    required: false
  working-directory:
    description: "Directory to run pyright in. If not specified, the repo root will be used."
    required: false
  no-comments:
    description: "Disable issue/commit comments."
    required: false
    default: "false"

  # Shorthand for pyright flags
  create-stub:
    description: "Create type stub file(s) for import. Note: using this option disables commenting."
    required: false
  dependencies:
    description: "Emit import dependency information. Note: using this option disables commenting."
    required: false
  ignore-external:
    description: "Ignore external imports for verify-types."
    required: false
  level:
    description: "Minimum diagnostic level (error or warning)"
    required: false
  project:
    description: "Use the configuration file at this location."
    required: false
  python-platform:
    description: "Analyze for a specific platform (Darwin, Linux, Windows)."
    required: false
  python-path:
    description: "Path to the Python interpreter."
    required: false
  python-version:
    description: "Analyze for a specific version (3.3, 3.4, etc.)."
    required: false
  skip-unannotated:
    description: "Skip analysis of functions with no type annotations."
    required: false
  stats:
    description: "Print detailed performance stats. Note: using this option disables commenting."
    required: false
  typeshed-path:
    description: "Use typeshed type stubs at this location."
    required: false
  venv-path:
    description: "Directory that contains virtual environments."
    required: false
  verbose:
    description: "Emit verbose diagnostics. Note: using this option disables commenting."
    required: false
  verify-types:
    description: "Package name to run the type verifier on; must be an *installed* library. Any score under 100% will fail the build. Using this option disables commenting."
    required: false
  warnings:
    description: "Use exit code of 1 if warnings are reported."
    required: false
    default: "false"

  # Extra arguments (if what you want isn't listed above)
  extra-args:
    description: "Extra arguments; can be used to specify specific files to check."
    required: false

  # Removed in pyright 1.1.303
  lib:
    description: "Use library code to infer types when stubs are missing."
    required: false
    default: "false"
```

## Releasing `pyright-action`

Releases are performed by `release-it`, which correctly tags a new version and
re-tags `v1`. Unfortunately, you can only publish a GitHub action via the web UI
(not via the API), so `release-it` must be configured to open a browser to
create the release, where the marketplace checkbox will already be checked.

```
$ npx release-it --ci                    # Release a patch version
$ npx release-it --ci --increment minor  # Release a minor version bump.
$ npx release-it --ci --increment major  # Don't do this unless .release-it.json is updated to potentially retag a new major version.
```
