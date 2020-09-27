const path = require('path');
const createJestConfig = require('react-scripts/scripts/utils/createJestConfig');

const pathReactScripts = path.resolve(__dirname, '..', '..', 'node_modules', 'react-scripts');

const jestConfig = createJestConfig(
  (relativePath) => path.resolve(pathReactScripts, relativePath),
  path.resolve(__dirname),
  false
);

module.exports = {
  ...jestConfig,
  setupFilesAfterEnv: [
    ...jestConfig.setupFilesAfterEnv,
    ...[
      (!jestConfig.setupFilesAfterEnv.find(item => item.includes('setupTests'))?"<rootDir>/src/setupTests.ts":undefined),
    ],
  ],
};