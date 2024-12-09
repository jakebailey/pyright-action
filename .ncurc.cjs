module.exports = {
    target: (dependencyName, [{ semver, version, operator, major, minor, patch, release, build }]) => {
        if (dependencyName === "@actions/http-client") return "patch"; // bloated via undici
        if (dependencyName === "semver") return "patch"; // Matching dep from @actions/*
        if (dependencyName === "@types/semver") return "patch"; // Matching dep from @actions/*
        if (dependencyName === "@types/node") return "minor";
        if (major === "0") return "minor";
        return "latest";
    },
};
