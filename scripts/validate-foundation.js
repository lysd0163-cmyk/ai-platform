const { EventBus } = require('../core/events/bus');
const { Container } = require('../core/di/container');
const { PluginRegistry } = require('../core/plugins/registry');
const { createErrorHandler } = require('../core/errors/handler');
const { loadConfig } = require('../config');

const bus = new EventBus();
let pingCount = 0;
bus.on('ping', () => {
  pingCount += 1;
});
bus.emit('ping', { ok: true });

const container = new Container();
container.register('value', 42);

const plugins = new PluginRegistry();
plugins.register('demo', { name: 'demo' });

const handleError = createErrorHandler(console);
const errorPayload = handleError(new Error('validation check'), { step: 'foundation' });
const config = loadConfig({ execution: { enabled: true } });

if (pingCount !== 1) {
  throw new Error('EventBus validation failed');
}

if (container.resolve('value') !== 42) {
  throw new Error('Container validation failed');
}

if (!plugins.has('demo')) {
  throw new Error('Plugin registry validation failed');
}

if (!errorPayload || errorPayload.context.step !== 'foundation') {
  throw new Error('Error handler validation failed');
}

if (!config.execution || config.execution.enabled !== true) {
  throw new Error('Config loader validation failed');
}

console.log('Foundation validation passed');
