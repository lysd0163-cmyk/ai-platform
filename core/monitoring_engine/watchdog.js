function evaluateWatchdog({ zones = [], latestCandle = null } = {}) {
  return {
    activeZones: zones.filter(Boolean).length,
    latestCandle,
    needsRebuild: zones.length === 0 || latestCandle === null,
  };
}

module.exports = {
  evaluateWatchdog,
};
