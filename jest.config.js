module.exports = {
    setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
    testEnvironment: "jsdom",
    transform: {
      "^.+\\.jsx?$": "babel-jest"
    },
    transformIgnorePatterns: [
        "/node_modules/(?!(@mui|axios|react-router-dom|react-audio-analyser|homophones)/).+\\.js$"
    ],
    moduleNameMapper: {
      "\\.(css|less|sass|scss)$": "identity-obj-proxy",
      "\\.(gif|ttf|eot|svg|png|mp3|m4a|wav|jpg)$": "<rootDir>/__mocks__/fileMock.js"
    },
    collectCoverage: true,
    collectCoverageFrom: [
      "src/**/*.{js,jsx}",
      "!src/**/*.test.{js,jsx}",
      "!src/serviceWorker.js",
      "!src/setupTests.js"
    ],
    coverageDirectory: "<rootDir>/coverage",
    coverageReporters: ["html", "text", "text-summary", "lcov"]
  };