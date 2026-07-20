function createZone({ side, pair, timeframe, top, bottom, reason = '' } = {}) {
  return {
    id: `${side || 'zone'}-${pair || 'UNKNOWN'}-${timeframe || 'NA'}-${Date.now()}`,
    side,
    pair,
    timeframe,
    top,
    bottom,
    reason,
    isValid: true,
    createdAt: new Date().toISOString(),
  };
}

module.exports = {
  createZone,
};
