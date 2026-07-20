function toCandleSeries(marketSnapshot = {}) {
  return Array.isArray(marketSnapshot?.candles) ? marketSnapshot.candles : [];
}

function detectSwings(candles = []) {
  const swings = [];
  for (let index = 1; index < candles.length - 1; index += 1) {
    const prev = candles[index - 1];
    const current = candles[index];
    const next = candles[index + 1];
    const high = Number(current.high);
    const low = Number(current.low);
    if (high > Number(prev.high) && high > Number(next.high)) {
      swings.push({ index, type: 'swing-high', price: high });
    }
    if (low < Number(prev.low) && low < Number(next.low)) {
      swings.push({ index, type: 'swing-low', price: low });
    }
  }
  return swings;
}

function detectBosChoch(candles = []) {
  if (candles.length < 3) {
    return { bos: false, choch: false, trend: 'neutral', reason: 'insufficient-data' };
  }

  const first = candles[0];
  const mid = candles[Math.floor(candles.length / 2)];
  const last = candles[candles.length - 1];
  const trend = Number(last.close) > Number(first.close) ? 'bullish' : Number(last.close) < Number(first.close) ? 'bearish' : 'neutral';
  const bos = trend === 'bullish' ? Number(last.high) > Number(mid.high) : trend === 'bearish' ? Number(last.low) < Number(mid.low) : false;
  const choch = trend === 'bullish' ? Number(last.low) < Number(mid.low) : trend === 'bearish' ? Number(last.high) > Number(mid.high) : false;

  return {
    bos,
    choch,
    trend,
    reason: trend === 'bullish' ? 'structure expanding upward' : trend === 'bearish' ? 'structure expanding downward' : 'structure neutral',
  };
}

function runStructureEngine({ marketSnapshot } = {}) {
  const candles = toCandleSeries(marketSnapshot);
  const swings = detectSwings(candles);
  const structuralSignals = detectBosChoch(candles);

  return {
    marketSnapshot,
    status: candles.length > 0 ? 'ready' : 'empty',
    structure: {
      trend: structuralSignals.trend,
      bos: structuralSignals.bos,
      choch: structuralSignals.choch,
      swings,
      reason: structuralSignals.reason,
    },
  };
}

module.exports = {
  toCandleSeries,
  detectSwings,
  detectBosChoch,
  runStructureEngine,
};
