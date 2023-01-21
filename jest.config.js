// @ts-check
/* eslint-disable unicorn/prefer-module */

/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    collectCoverageFrom: ["src/**/*.ts"],
    coveragePathIgnorePatterns: [
        "src/index.ts", // Just the bundle entrypoint
        "\\.d\\.ts",
    ],
    watchPathIgnorePatterns: ["dist/index.js"],
};
