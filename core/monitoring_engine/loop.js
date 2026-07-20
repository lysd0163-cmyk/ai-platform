function runMonitoringLoop({ pair = null, zones = [], latestSnapshot = null, previousState = {} } = {}) {
  const invalidZone = zones.find((zone) => zone && (zone.isValid === false || zone.exhausted === true || zone.expired === true));
  const rebuildRequested = Boolean(invalidZone || !latestSnapshot || zones.length === 0);

  return {
    pair,
    zones,
    latestSnapshot,
    previousState,
    activeZones: zones.filter(Boolean).length,
    rebuildRequested,
    invalidationReason: invalidZone ? invalidZone.reason || invalidZone.status || 'zone-invalid' : (!latestSnapshot ? 'missing-snapshot' : zones.length === 0 ? 'no-zones' : null),
    status: rebuildRequested ? 'rebuild' : 'watching',
    tickAt: new Date().toISOString(),
  };
}

module.exports = {
  runMonitoringLoop,
};
