export default {
  testEnvironment: "node",
  transform: {},
  testTimeout: 120000,
  collectCoverageFrom: [
    "src/**/*.js",
    "!src/server.js",
    "!src/scripts/**"
  ]
};
