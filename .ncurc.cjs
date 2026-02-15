module.exports = {
    target: (dependencyName, [{ semver, version, operator, major, minor, patch, release, build }]) => {
        if (dependencyName === "semver") return "minor"; // Matching dep from @actions/*
        if (dependencyName === "@types/semver") return "minor"; // Matching dep from @actions/*
        if (dependencyName === "@types/node") return "minor";
        if (dependencyName === "eslint") return "minor";
        if (dependencyName === "@eslint/js") return "minor";
        if (major === "0") return "minor";
        return "latest";
    },
};
