function assembleMarketSnapshot({ pair, timeframe, candles = [] } = {}) {
  return {
    pair,
    timeframe,
    candles,
    candleCount: candles.length,
    status: 'assembled',
    assembledAt: new Date().toISOString(),
  };
}

module.exports = {
  assembleMarketSnapshot,
};
