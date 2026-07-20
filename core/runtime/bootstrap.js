const { startOrchestrator } = require('../orchestrator');
const { startApi } = require('../../api/server');
const { startDashboard } = require('../../dashboard/app');

function startPlatform({ strategyInput = null, pairs = null, timeframes = null, marketData = {}, apiPort = 4000, dashboardPort = 3000 } = {}) {
  const runtime = startOrchestrator({ strategyInput, pairs, timeframes, marketData });
  const apiServer = startApi({ port: apiPort, runtime });
  const dashboardServer = startDashboard({ port: dashboardPort, runtime });

  return {
    runtime,
    apiServer,
    dashboardServer,
  };
}

module.exports = {
  startPlatform,
};
