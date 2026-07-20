function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function buildCandidateZones({ candles = [], range = null, trend = 'neutral', bias = 'neutral', signals = {} } = {}) {
  if (!range || candles.length === 0) {
    return { buyZone: null, sellZone: null, status: 'insufficient-data' };
  }

  const spread = range.width || 0;
  const liquidityBias = signals.liquidity?.bias || 'neutral';
  const structureTrend = signals.structure?.trend || trend;
  const obDirection = signals.orderBlock?.direction || null;
  const fvgDirection = signals.fvg?.direction || null;

  const buyStrength = [structureTrend === 'bullish', bias === 'discount', liquidityBias.startsWith('bullish'), obDirection === 'buy', fvgDirection === 'buy']
    .filter(Boolean)
    .length;
  const sellStrength = [structureTrend === 'bearish', bias === 'premium', liquidityBias.startsWith('bearish'), obDirection === 'sell', fvgDirection === 'sell']
    .filter(Boolean)
    .length;

  const buyRatio = clamp(0.18 + buyStrength * 0.06, 0.18, 0.45);
  const sellRatio = clamp(0.18 + sellStrength * 0.06, 0.18, 0.45);

  const buyBottom = range.low;
  const buyTop = range.low + spread * buyRatio;
  const sellTop = range.high;
  const sellBottom = range.high - spread * sellRatio;

  return {
    buyZone: {
      side: 'buy',
      top: Number(buyTop.toFixed(5)),
      bottom: Number(buyBottom.toFixed(5)),
      width: Number((buyTop - buyBottom).toFixed(5)),
      strength: buyStrength,
      source: {
        liquidityBias,
        structureTrend,
        obDirection,
        fvgDirection,
      },
      status: 'candidate',
    },
    sellZone: {
      side: 'sell',
      top: Number(sellTop.toFixed(5)),
      bottom: Number(sellBottom.toFixed(5)),
      width: Number((sellTop - sellBottom).toFixed(5)),
      strength: sellStrength,
      source: {
        liquidityBias,
        structureTrend,
        obDirection,
        fvgDirection,
      },
      status: 'candidate',
    },
    status: 'generated',
  };
}

function rankZone(zone, analysis = {}) {
  if (!zone) {
    return null;
  }

  const layerPasses = Array.isArray(analysis.layers) ? analysis.layers.filter((layer) => layer.value).length : 0;
  const totalLayers = Array.isArray(analysis.layers) ? analysis.layers.length : 0;
  const width = Number(zone.width) || 0;
  const rangeWidth = analysis.range?.width || 1;
  const compactness = rangeWidth > 0 ? Math.max(0, 1 - width / rangeWidth) : 0;
  const signalStrength = Number(zone.strength || 0) / 5;
  const score = (totalLayers === 0 ? 0 : layerPasses / totalLayers) * 0.6 + compactness * 0.2 + signalStrength * 0.2;

  return {
    ...zone,
    score: Number(score.toFixed(4)),
    layersPassed: layerPasses,
    layersTotal: totalLayers,
    valid: layerPasses === totalLayers && totalLayers > 0,
  };
}

module.exports = {
  buildCandidateZones,
  rankZone,
};
