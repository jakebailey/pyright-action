module.exports = {
    target: (dependencyName, [{ semver, version, operator, major, minor, patch, release, build }]) => {
        if (dependencyName === "@actions/http-client") return "patch"; // bloated via undici
        if (major === "0") return "minor";
        return "latest";
    },
};
