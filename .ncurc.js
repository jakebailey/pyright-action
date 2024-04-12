module.exports = {
    target: (dependencyName, [{ semver, version, operator, major, minor, patch, release, build }]) => {
        if (dependencyName === "@actions/http-client") return "patch"; // bloated via undici
        if (dependencyName === "eslint") return "patch";
        if (dependencyName === "semver") return "patch"; // Matching dep from @actions/*
        if (dependencyName === "@types/semver") return "patch"; // Matching dep from @actions/*
        if (major === "0") return "minor";
        return "latest";
    },
};
