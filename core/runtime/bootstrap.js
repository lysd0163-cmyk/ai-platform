const { startOrchestrator } = require('../orchestrator');
const { createAcquisitionLoop } = require('../data_acquisition');
const { startApi } = require('../../api/server');
const { startDashboard } = require('../../dashboard/app');

function startPlatform({ strategyInput = null, pairs = null, timeframes = null, marketData = {}, chartData = {}, candleLimit = 500, refreshIntervalMs = 30000, apiPort = 4000, dashboardPort = 3000 } = {}) {
  const runtimeRef = {
    current: startOrchestrator({ strategyInput, pairs, timeframes, marketData, chartData, candleLimit }),
  };

  const acquisitionLoop = createAcquisitionLoop({
    intervalMs: refreshIntervalMs,
    acquireFn: async () => {
      runtimeRef.current = startOrchestrator({ strategyInput, pairs, timeframes, marketData, chartData, candleLimit });
      return runtimeRef.current;
    },
  });

  if (refreshIntervalMs > 0) {
    acquisitionLoop.start().catch(() => null);
  }

  const apiServer = startApi({ port: apiPort, runtimeRef });
  const dashboardServer = startDashboard({ port: dashboardPort, runtimeRef });

  return {
    runtimeRef,
    acquisitionLoop,
    apiServer,
    dashboardServer,
  };
}

module.exports = {
  startPlatform,
};
