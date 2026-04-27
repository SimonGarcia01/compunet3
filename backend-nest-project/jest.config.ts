import type { Config } from 'jest';

const config: Config = {
    clearMocks: true,
    collectCoverage: true,
    coverageDirectory: 'coverage',
    coverageProvider: 'v8',
    preset: 'ts-jest',
    testEnvironment: 'node',
    //Where all the tests files would go
    roots: ['./src'],
    //transform typescript files to javascript using ts-jest
    transform: {
        '^.+\\.ts$': 'ts-jest',
    },
    // So jest knows which files are test files
    //*.spec.ts
    testRegex: '(\\.|./)spec\\.ts$',
    moduleFileExtensions: ['ts', 'json', 'node', 'js'],
    moduleDirectories: ['node_modules', '<rootDir>'],
    moduleNameMapper: {
        '^src/(.*)$': '<rootDir>/src/$1',
    },
    //Which files to collect the coverage from
    collectCoverageFrom: ['src/**/*.service.ts'],
};

export default config;
