module.exports = {
    globals:{
        "ts-jest": {
            tsConfig: 'tsconfig.spec.json',
            diagnostics: false
        },
    },
    testEnvironment: 'node',
    transform: {
        "^.+\\.tsx?$": "ts-jest"
    },
    moduleFileExtensions: [
        "ts",
        "tsx",
        "js",
        "jsx",
        "json",
        "node",
    ],
    testRegex: '(/tests/.*|(\\.|/)(test|spec))\\.(ts|js)x?$',
    testPathIgnorePatterns: ["/dummyclient/", "/fixture/", "testUtil.ts", ".wercker/"], // 無視するファイル
    coverageDirectory: 'coverage',
    collectCoverageFrom: [
        'src/**/*.{ts,tsx,js,jsx}',
        '!src/**/*.d.ts',
    ],
};
