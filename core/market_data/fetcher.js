function fetchMarketData({ pair, timeframe } = {}) {
  return {
    pair,
    timeframe,
    candles: [],
    source: 'placeholder',
    fetchedAt: new Date().toISOString(),
  };
}

module.exports = {
  fetchMarketData,
};
