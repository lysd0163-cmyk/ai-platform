function normalizeOhlc(candles = []) {
  return candles.map((candle, index) => ({
    index,
    open: candle.open,
    high: candle.high,
    low: candle.low,
    close: candle.close,
    volume: candle.volume ?? 0,
    time: candle.time ?? null,
  }));
}

module.exports = {
  normalizeOhlc,
};
