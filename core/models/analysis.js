function createAnalysis({ pair, timeframe, status = 'pending', notes = [], zones = [] } = {}) {
  return {
    id: `${pair || 'UNKNOWN'}-${timeframe || 'NA'}-${Date.now()}`,
    pair,
    timeframe,
    status,
    notes,
    zones,
    createdAt: new Date().toISOString(),
  };
}

module.exports = {
  createAnalysis,
};
