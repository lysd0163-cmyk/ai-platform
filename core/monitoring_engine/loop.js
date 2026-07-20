function runMonitoringLoop({ pair = null, zones = [], latestSnapshot = null, previousState = {}, entrySignal = null } = {}) {
  const invalidZone = zones.find((zone) => zone && (zone.isValid === false || zone.exhausted === true || zone.expired === true || zone.score !== undefined && zone.score < 0.5));
  const missingData = !latestSnapshot || zones.length === 0;
  const rebuildRequested = Boolean(invalidZone || missingData || (entrySignal && entrySignal.passed === false && entrySignal.phase === 'insufficient-data'));

  return {
    pair,
    zones,
    latestSnapshot,
    previousState,
    entrySignal,
    activeZones: zones.filter(Boolean).length,
    rebuildRequested,
    reasons: [
      invalidZone ? invalidZone.reason || invalidZone.status || 'zone-invalid' : null,
      !latestSnapshot ? 'missing-snapshot' : null,
      zones.length === 0 ? 'no-zones' : null,
      entrySignal && entrySignal.passed === false ? `entry-${entrySignal.phase || 'pending'}` : null,
    ].filter(Boolean),
    invalidationReason: invalidZone ? invalidZone.reason || invalidZone.status || 'zone-invalid' : (!latestSnapshot ? 'missing-snapshot' : zones.length === 0 ? 'no-zones' : null),
    status: rebuildRequested ? 'rebuild' : 'watching',
    tickAt: new Date().toISOString(),
  };
}

module.exports = {
  runMonitoringLoop,
};
