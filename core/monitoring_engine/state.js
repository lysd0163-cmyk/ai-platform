function createMonitoringState({ pair = null, timeframes = [], zones = [] } = {}) {
  return {
    pair,
    timeframes,
    zones,
    active: true,
    watchedPairs: pair ? [pair] : [],
    lastSweepAt: null,
    lastAnalysisAt: null,
    lastInvalidationReason: null,
    rebuildRequested: false,
  };
}

module.exports = {
  createMonitoringState,
};
