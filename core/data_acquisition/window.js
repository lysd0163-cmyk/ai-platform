function normalizeCandles(candles = []) {
  return candles
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
}

function trimCandleWindow(candles = [], limit = 500) {
  const normalized = normalizeCandles(candles);
  const trimmed = normalized.slice(-Math.max(1, Number(limit) || 500));
  const high = trimmed.length > 0 ? Math.max(...trimmed.map((candle) => candle.high)) : null;
  const low = trimmed.length > 0 ? Math.min(...trimmed.map((candle) => candle.low)) : null;

  return {
    candles: trimmed,
    candleCount: trimmed.length,
    limit: Math.max(1, Number(limit) || 500),
    range: high !== null && low !== null ? { high, low, width: high - low } : null,
    status: trimmed.length > 0 ? 'ready' : 'empty',
  };
}

module.exports = {
  normalizeCandles,
  trimCandleWindow,
};
