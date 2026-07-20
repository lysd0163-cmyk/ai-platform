function buildCandidateZones({ candles = [], range = null, trend = 'neutral', bias = 'neutral' } = {}) {
  if (!range || candles.length === 0) {
    return { buyZone: null, sellZone: null, status: 'insufficient-data' };
  }

  const spread = range.width || 0;
  const buyBottom = range.low;
  const buyTop = range.low + spread * (trend === 'bullish' || bias === 'discount' ? 0.35 : 0.25);
  const sellTop = range.high;
  const sellBottom = range.high - spread * (trend === 'bearish' || bias === 'premium' ? 0.35 : 0.25);

  return {
    buyZone: {
      side: 'buy',
      top: Number(buyTop.toFixed(5)),
      bottom: Number(buyBottom.toFixed(5)),
      width: Number((buyTop - buyBottom).toFixed(5)),
      status: 'candidate',
    },
    sellZone: {
      side: 'sell',
      top: Number(sellTop.toFixed(5)),
      bottom: Number(sellBottom.toFixed(5)),
      width: Number((sellTop - sellBottom).toFixed(5)),
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
  const score = (totalLayers === 0 ? 0 : layerPasses / totalLayers) * 0.7 + compactness * 0.3;

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
