/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/configuration
 */

export default {
  preset: "ts-jest",
  transform: {
    "^.+\\.(ts|tsx)?$": "ts-jest",
    "^.+\\.(js|jsx)$": "babel-jest",
  },
  clearMocks: true,
  collectCoverage: false,
  coveragePathIgnorePatterns: ["/node_modules/"],
  coverageProvider: "v8",
};
