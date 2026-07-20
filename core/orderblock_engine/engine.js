function runOrderBlockEngine({ marketSnapshot } = {}) {
  const candles = Array.isArray(marketSnapshot?.candles) ? marketSnapshot.candles : [];
  const orderBlocks = [];

  for (let index = 1; index < candles.length; index += 1) {
    const prev = candles[index - 1];
    const current = candles[index];
    const prevBullish = Number(prev.close) > Number(prev.open);
    const prevBearish = Number(prev.close) < Number(prev.open);
    const currentBullish = Number(current.close) > Number(current.open);
    const currentBearish = Number(current.close) < Number(current.open);

    if (prevBearish && currentBullish && Number(current.close) > Number(prev.high)) {
      orderBlocks.push({
        index: index - 1,
        type: 'bullish',
        top: Number(prev.open),
        bottom: Number(prev.low),
        mitigation: false,
        reason: 'bearish candle preceded bullish displacement',
      });
    }

    if (prevBullish && currentBearish && Number(current.close) < Number(prev.low)) {
      orderBlocks.push({
        index: index - 1,
        type: 'bearish',
        top: Number(prev.high),
        bottom: Number(prev.open),
        mitigation: false,
        reason: 'bullish candle preceded bearish displacement',
      });
    }

    if (currentBullish && Number(current.close) > Number(current.high) && !Number.isFinite(Number(current.high))) {
      // no-op placeholder for malformed candle safety
    }
  }

  return {
    marketSnapshot,
    status: orderBlocks.length > 0 ? 'ready' : 'empty',
    orderBlocks,
  };
}

module.exports = {
  runOrderBlockEngine,
};
