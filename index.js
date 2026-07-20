const { startPlatform } = require('./core/runtime/bootstrap');

startPlatform().catch((error) => {
  console.error('Failed to start AI Platform:', error);
  process.exitCode = 1;
});
