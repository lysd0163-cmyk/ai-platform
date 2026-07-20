function createMonitoringState() {
  return {
    active: false,
    watchedPairs: [],
    lastSweepAt: null,
  };
}

module.exports = {
  createMonitoringState,
};
