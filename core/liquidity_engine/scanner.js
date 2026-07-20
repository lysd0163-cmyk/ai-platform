function scanLiquidity({ candles = [] } = {}) {
  if (!Array.isArray(candles) || candles.length < 3) {
    return {
      candles,
      status: 'insufficient-data',
      sweeps: [],
      externalLiquidity: [],
      internalLiquidity: [],
      bias: 'neutral',
    };
  }

  const highs = candles.map((candle) => Number(candle.high)).filter(Number.isFinite);
  const lows = candles.map((candle) => Number(candle.low)).filter(Number.isFinite);
  const high = Math.max(...highs);
  const low = Math.min(...lows);
  const midpoint = low + (high - low) / 2;

  const externalLiquidity = [
    { side: 'buy', price: high, label: 'equal-high / external buy-side liquidity' },
    { side: 'sell', price: low, label: 'equal-low / external sell-side liquidity' },
  ];

  const recent = candles.slice(-3);
  const last = recent[recent.length - 1];
  const prior = recent[recent.length - 2];
  const first = recent[0];

  const buySideSweep = Number(last.high) > high * 0.998 && Number(last.close) < Number(last.open) && Number(prior.close) < Number(first.close);
  const sellSideSweep = Number(last.low) < low * 1.002 && Number(last.close) > Number(last.open) && Number(prior.close) > Number(first.close);

  const sweeps = [];
  if (buySideSweep) {
    sweeps.push({ side: 'buy-side', strength: 1, reason: 'High was swept and rejected' });
  }
  if (sellSideSweep) {
    sweeps.push({ side: 'sell-side', strength: 1, reason: 'Low was swept and rejected' });
  }

  const internalLiquidity = candles
    .slice(1, -1)
    .map((candle, index) => ({
      index: index + 1,
      price: Number(candle.close),
      label: Number(candle.close) > midpoint ? 'premium internal liquidity' : 'discount internal liquidity',
    }))
    .filter((item) => Number.isFinite(item.price));

  const bias = buySideSweep && !sellSideSweep
    ? 'bullish'
    : sellSideSweep && !buySideSweep
      ? 'bearish'
      : last.close >= midpoint
        ? 'bullish-lean'
        : 'bearish-lean';

  return {
    candles,
    status: sweeps.length > 0 ? 'sweep-detected' : 'scanned',
    high,
    low,
    midpoint,
    sweeps,
    externalLiquidity,
    internalLiquidity,
    bias,
  };
}

module.exports = {
  scanLiquidity,
};
