const { EventBus } = require('./events/bus');
const { Container } = require('./di/container');
const { PluginRegistry } = require('./plugins/registry');
const { createErrorHandler, normalizeError } = require('./errors/handler');
const { defaultConfig, loadConfig } = require('../config');
const { log } = require('./utils/logger');

module.exports = {
  EventBus,
  Container,
  PluginRegistry,
  createErrorHandler,
  normalizeError,
  defaultConfig,
  loadConfig,
  log,
};
