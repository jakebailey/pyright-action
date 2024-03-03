# Contributing

## Releasing `pyright-action`

Releases are performed by `release-it`, which correctly tags a new version and
re-tags `v2`. Unfortunately, you can only publish a GitHub action via the web UI
(not via the API), so `release-it` must be configured to open a browser to
create the release, where the marketplace checkbox will already be checked.

```
$ pnpx release-it --ci                    # Release a patch version
$ pnpx release-it --ci --increment minor  # Release a minor version bump.
$ pnpx release-it --ci --increment major  # Don't do this unless .release-it.json is updated to potentially retag a new major version.
```
