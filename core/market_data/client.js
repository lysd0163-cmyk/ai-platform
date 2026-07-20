function createMarketDataClient({ provider = 'placeholder' } = {}) {
  return {
    provider,
    getCandles: async ({ pair, timeframe }) => ({
      pair,
      timeframe,
      candles: [],
      provider,
      status: 'placeholder',
    }),
  };
}

module.exports = {
  createMarketDataClient,
};
