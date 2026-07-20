function createGeneratedChartEvidence({ pair, timeframe, candles = [] } = {}) {
  const first = candles[0] || null;
  const last = candles[candles.length - 1] || null;
  const high = candles.length > 0 ? Math.max(...candles.map((candle) => Number(candle.high)).filter(Number.isFinite)) : null;
  const low = candles.length > 0 ? Math.min(...candles.map((candle) => Number(candle.low)).filter(Number.isFinite)) : null;

  return {
    pair,
    timeframe,
    source: 'local-generated-chart',
    caption: `Generated chart evidence for ${pair || 'UNKNOWN'} ${timeframe || 'NA'} | candles=${candles.length}`,
    chartType: 'ohlc-derived-evidence',
    evidence: true,
    firstTime: first?.time || null,
    lastTime: last?.time || null,
    high,
    low,
    candles: candles.length,
  };
}

module.exports = {
  createGeneratedChartEvidence,
};
