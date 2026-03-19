/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

import type { Config } from 'jest';

const config: Config = {
    clearMocks: true,
    collectCoverage: true,
    coverageDirectory: "coverage",
    coverageProvider: "v8",
    preset: "ts-jest",
    testEnvironment: "node",
    roots: ["./src"],
    transform: {
        "^.+\\.ts?$": "ts-jest"
    },
    testRegex: "(\\.|/)spec\\.ts$",
    moduleFileExtensions: ["ts", "js", "json", "node"],
    collectCoverageFrom: [
        "src/**/*.service.ts",
    ]
};

export default config;