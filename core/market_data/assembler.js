function assembleMarketSnapshot({ pair, timeframe, candles = [], source = 'placeholder' } = {}) {
  const normalizedCandles = candles
    .map((candle, index) => ({
      index,
      open: Number(candle.open),
      high: Number(candle.high),
      low: Number(candle.low),
      close: Number(candle.close),
      volume: Number(candle.volume ?? 0),
      time: candle.time ?? candle.timestamp ?? null,
      valid: [Number(candle.open), Number(candle.high), Number(candle.low), Number(candle.close)].every(Number.isFinite),
    }))
    .filter((candle) => candle.valid);

  const high = normalizedCandles.length > 0 ? Math.max(...normalizedCandles.map((candle) => candle.high)) : null;
  const low = normalizedCandles.length > 0 ? Math.min(...normalizedCandles.map((candle) => candle.low)) : null;

  return {
    pair,
    timeframe,
    candles: normalizedCandles,
    candleCount: normalizedCandles.length,
    range: high !== null && low !== null ? { high, low, width: high - low } : null,
    source,
    status: normalizedCandles.length > 0 ? 'assembled' : 'empty',
    assembledAt: new Date().toISOString(),
  };
}

module.exports = {
  assembleMarketSnapshot,
};
