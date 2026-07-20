function normalizeCandle(candle = {}, index = 0) {
  const open = Number(candle.open);
  const high = Number(candle.high);
  const low = Number(candle.low);
  const close = Number(candle.close);

  return {
    index,
    open,
    high,
    low,
    close,
    volume: Number(candle.volume ?? 0),
    time: candle.time ?? candle.timestamp ?? null,
    timeframe: candle.timeframe ?? null,
    pair: candle.pair ?? null,
    valid: [open, high, low, close].every(Number.isFinite),
  };
}

function fetchMarketData({ pair, timeframe, candles = [], source = 'placeholder' } = {}) {
  const normalizedCandles = candles.map((candle, index) => normalizeCandle(candle, index));
  const validCandles = normalizedCandles.filter((candle) => candle.valid);

  return {
    pair,
    timeframe,
    candles: validCandles,
    rawCandles: normalizedCandles,
    source,
    status: validCandles.length > 0 ? 'ready' : 'empty',
    fetchedAt: new Date().toISOString(),
  };
}

module.exports = {
  normalizeCandle,
  fetchMarketData,
};
