function createMarketSnapshot({ pair, timeframe, candles = [], source = 'unknown' } = {}) {
  return {
    pair,
    timeframe,
    candles,
    source,
    capturedAt: new Date().toISOString(),
  };
}

module.exports = {
  createMarketSnapshot,
};
