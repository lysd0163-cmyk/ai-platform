async function loadFeed({ pair, timeframe } = {}) {
  return {
    pair,
    timeframe,
    candles: [],
    status: 'empty',
    source: 'placeholder-feed',
    loadedAt: new Date().toISOString(),
  };
}

module.exports = {
  loadFeed,
};
