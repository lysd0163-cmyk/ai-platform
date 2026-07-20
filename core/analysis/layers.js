function flattenCandles(marketSnapshots = []) {
  return marketSnapshots.flatMap((snapshot, snapshotIndex) => {
    const candles = Array.isArray(snapshot?.candles) ? snapshot.candles : [];
    return candles.map((candle, candleIndex) => ({
      ...candle,
      snapshotIndex,
      candleIndex,
      timeframe: snapshot?.timeframe ?? candle?.timeframe ?? null,
      pair: snapshot?.pair ?? candle?.pair ?? null,
    }));
  });
}

function getRange(candles = []) {
  if (candles.length === 0) {
    return null;
  }

  const highs = candles.map((candle) => Number(candle.high)).filter(Number.isFinite);
  const lows = candles.map((candle) => Number(candle.low)).filter(Number.isFinite);

  if (highs.length === 0 || lows.length === 0) {
    return null;
  }

  const high = Math.max(...highs);
  const low = Math.min(...lows);
  const midpoint = low + (high - low) / 2;

  return { high, low, midpoint, width: high - low };
}

function detectTrend(candles = []) {
  if (candles.length < 2) {
    return 'neutral';
  }

  const firstClose = Number(candles[0].close);
  const lastClose = Number(candles[candles.length - 1].close);

  if (!Number.isFinite(firstClose) || !Number.isFinite(lastClose)) {
    return 'neutral';
  }

  if (lastClose > firstClose) {
    return 'bullish';
  }

  if (lastClose < firstClose) {
    return 'bearish';
  }

  return 'neutral';
}

function detectLiquidity(candles = []) {
  const range = getRange(candles);
  if (!range) {
    return { passed: false, reason: 'No price range available', sweepSide: null };
  }

  const last = candles[candles.length - 1];
  const bullishSweep = Number(last?.close) >= range.midpoint && Number(last?.low) <= range.low + range.width * 0.15;
  const bearishSweep = Number(last?.close) <= range.midpoint && Number(last?.high) >= range.high - range.width * 0.15;

  if (bullishSweep) {
    return { passed: true, reason: 'Bullish liquidity sweep detected', sweepSide: 'buy-side' };
  }

  if (bearishSweep) {
    return { passed: true, reason: 'Bearish liquidity sweep detected', sweepSide: 'sell-side' };
  }

  return { passed: false, reason: 'No clear liquidity sweep', sweepSide: null };
}

function detectStructure(candles = []) {
  const trend = detectTrend(candles);
  const higherHighs = candles.every((candle, index) => index === 0 || Number(candle.high) >= Number(candles[index - 1].high) || !Number.isFinite(Number(candles[index - 1].high)));
  const higherLows = candles.every((candle, index) => index === 0 || Number(candle.low) >= Number(candles[index - 1].low) || !Number.isFinite(Number(candles[index - 1].low)));
  const lowerHighs = candles.every((candle, index) => index === 0 || Number(candle.high) <= Number(candles[index - 1].high) || !Number.isFinite(Number(candles[index - 1].high)));
  const lowerLows = candles.every((candle, index) => index === 0 || Number(candle.low) <= Number(candles[index - 1].low) || !Number.isFinite(Number(candles[index - 1].low)));

  return {
    trend,
    bullishStructure: trend === 'bullish' || (higherHighs && higherLows),
    bearishStructure: trend === 'bearish' || (lowerHighs && lowerLows),
    reason: trend === 'bullish' ? 'Structure is expanding upward' : trend === 'bearish' ? 'Structure is expanding downward' : 'Structure is neutral',
  };
}

function detectOrderBlock(candles = []) {
  if (candles.length < 2) {
    return { passed: false, reason: 'Not enough candles for order block', direction: null };
  }

  const last = candles[candles.length - 1];
  const prev = candles[candles.length - 2];
  const lastBullish = Number(last.close) > Number(last.open);
  const prevBearish = Number(prev.close) < Number(prev.open);
  const lastBearish = Number(last.close) < Number(last.open);
  const prevBullish = Number(prev.close) > Number(prev.open);

  if (lastBullish && prevBearish) {
    return { passed: true, reason: 'Bullish order block candidate present', direction: 'buy' };
  }

  if (lastBearish && prevBullish) {
    return { passed: true, reason: 'Bearish order block candidate present', direction: 'sell' };
  }

  return { passed: false, reason: 'No clean order block transition', direction: null };
}

function detectFvg(candles = []) {
  if (candles.length < 3) {
    return { passed: false, reason: 'Not enough candles for FVG', direction: null };
  }

  for (let index = 2; index < candles.length; index += 1) {
    const first = candles[index - 2];
    const third = candles[index];
    if (Number(first.high) < Number(third.low)) {
      return { passed: true, reason: 'Bullish FVG found', direction: 'buy' };
    }
    if (Number(first.low) > Number(third.high)) {
      return { passed: true, reason: 'Bearish FVG found', direction: 'sell' };
    }
  }

  return { passed: false, reason: 'No FVG detected', direction: null };
}

function detectPremiumDiscount(candles = []) {
  const range = getRange(candles);
  if (!range || candles.length === 0) {
    return { passed: false, bias: 'neutral', reason: 'Insufficient range' };
  }

  const lastClose = Number(candles[candles.length - 1].close);
  if (!Number.isFinite(lastClose)) {
    return { passed: false, bias: 'neutral', reason: 'Invalid close data' };
  }

  if (lastClose < range.midpoint) {
    return { passed: true, bias: 'discount', reason: 'Price is trading in discount' };
  }

  if (lastClose > range.midpoint) {
    return { passed: true, bias: 'premium', reason: 'Price is trading in premium' };
  }

  return { passed: false, bias: 'equilibrium', reason: 'Price is at equilibrium' };
}

function detectMomentum(candles = []) {
  if (candles.length < 2) {
    return { passed: false, direction: 'neutral', reason: 'Not enough candles for momentum' };
  }

  const last = candles[candles.length - 1];
  const prev = candles[candles.length - 2];
  const delta = Number(last.close) - Number(prev.close);

  if (delta > 0) {
    return { passed: true, direction: 'buy', reason: 'Momentum is bullish' };
  }

  if (delta < 0) {
    return { passed: true, direction: 'sell', reason: 'Momentum is bearish' };
  }

  return { passed: false, direction: 'neutral', reason: 'Momentum is flat' };
}

function detectExecutionPath(timeframes = [], candles = []) {
  const hasM15 = timeframes.includes('M15');
  const hasHigherTimeframe = timeframes.some((timeframe) => ['D1', 'H4', 'H1'].includes(timeframe));
  const candleCount = candles.length;

  return {
    passed: hasM15 && hasHigherTimeframe && candleCount > 0,
    reason: hasM15 && hasHigherTimeframe ? 'Execution path available across required timeframes' : 'Missing required timeframe alignment',
  };
}

function detectRisk(candles = []) {
  const range = getRange(candles);
  if (!range) {
    return { passed: false, reason: 'Risk cannot be measured', rr: 0 };
  }

  const rr = range.width > 0 ? Math.min(5, Math.max(0.5, range.width / Math.max(range.width * 0.25, 1e-9))) : 0;
  return {
    passed: rr >= 1,
    rr,
    reason: rr >= 1 ? 'Risk profile acceptable' : 'Risk profile weak',
  };
}

function evaluateLayers({ timeframes = [], marketSnapshots = [] } = {}) {
  const candles = flattenCandles(marketSnapshots);
  const range = getRange(candles);
  const trend = detectTrend(candles);
  const liquidity = detectLiquidity(candles);
  const structure = detectStructure(candles);
  const orderBlock = detectOrderBlock(candles);
  const fvg = detectFvg(candles);
  const premiumDiscount = detectPremiumDiscount(candles);
  const momentum = detectMomentum(candles);
  const executionPath = detectExecutionPath(timeframes, candles);
  const risk = detectRisk(candles);

  const layers = [
    { name: 'liquidity', value: liquidity.passed, reason: liquidity.reason },
    { name: 'structure', value: structure.bullishStructure || structure.bearishStructure, reason: structure.reason },
    { name: 'orderBlock', value: orderBlock.passed, reason: orderBlock.reason },
    { name: 'fvg', value: fvg.passed, reason: fvg.reason },
    { name: 'premiumDiscount', value: premiumDiscount.passed, reason: premiumDiscount.reason },
    { name: 'momentum', value: momentum.passed, reason: momentum.reason },
    { name: 'executionPath', value: executionPath.passed, reason: executionPath.reason },
    { name: 'risk', value: risk.passed, reason: risk.reason },
  ];

  return {
    candles,
    range,
    trend,
    layers,
    signals: {
      liquidity,
      structure,
      orderBlock,
      fvg,
      premiumDiscount,
      momentum,
      executionPath,
      risk,
    },
  };
}

module.exports = {
  flattenCandles,
  getRange,
  detectTrend,
  detectLiquidity,
  detectStructure,
  detectOrderBlock,
  detectFvg,
  detectPremiumDiscount,
  detectMomentum,
  detectExecutionPath,
  detectRisk,
  evaluateLayers,
};
