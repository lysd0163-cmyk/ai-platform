function runFvgEngine({ marketSnapshot } = {}) {
  const candles = Array.isArray(marketSnapshot?.candles) ? marketSnapshot.candles : [];
  const gaps = [];

  for (let index = 2; index < candles.length; index += 1) {
    const first = candles[index - 2];
    const second = candles[index - 1];
    const third = candles[index];

    const bullishGap = Number(first.high) < Number(third.low);
    const bearishGap = Number(first.low) > Number(third.high);

    if (bullishGap) {
      gaps.push({
        index: index - 2,
        type: 'bullish',
        top: Number(third.low),
        bottom: Number(first.high),
        filled: Number(second.low) <= Number(third.low),
        reason: 'three-candle bullish displacement gap',
      });
    }

    if (bearishGap) {
      gaps.push({
        index: index - 2,
        type: 'bearish',
        top: Number(first.low),
        bottom: Number(third.high),
        filled: Number(second.high) >= Number(third.high),
        reason: 'three-candle bearish displacement gap',
      });
    }
  }

  return {
    marketSnapshot,
    status: gaps.length > 0 ? 'ready' : 'empty',
    gaps,
  };
}

module.exports = {
  runFvgEngine,
};
