const defaultConfig = require('./default.json');

function loadConfig(overrides = {}) {
  return {
    ...defaultConfig,
    ...overrides,
    execution: {
      ...defaultConfig.execution,
      ...(overrides.execution || {}),
    },
  };
}

module.exports = {
  defaultConfig,
  loadConfig,
};
