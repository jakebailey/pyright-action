/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    collectCoverageFrom: ['src/**/*.ts'],
    coveragePathIgnorePatterns: ['src/index.ts'], // Just the bundle entrypoint
    watchPathIgnorePatterns: ['dist/index.js'],
};
