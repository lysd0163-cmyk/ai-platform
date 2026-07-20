const { createGeneratedChartEvidence } = require('./generated_chart');

function normalizeChartAsset(asset = {}, fallback = {}) {
  const url = asset.url || asset.imageUrl || asset.chartUrl || null;
  const path = asset.path || asset.imagePath || asset.chartPath || null;
  const caption = asset.caption || fallback.caption || null;

  if (!url && !path && !asset.base64 && !asset.buffer && !caption) {
    return null;
  }

  return {
    pair: asset.pair || fallback.pair || null,
    timeframe: asset.timeframe || fallback.timeframe || null,
    url,
    path,
    caption,
    source: asset.source || fallback.source || 'unknown',
    capturedAt: asset.capturedAt || asset.timestamp || new Date().toISOString(),
    evidence: Boolean(url || path || asset.base64 || asset.buffer || caption),
    chartType: asset.chartType || fallback.chartType || null,
    firstTime: asset.firstTime || null,
    lastTime: asset.lastTime || null,
    high: asset.high ?? null,
    low: asset.low ?? null,
    candles: asset.candles ?? null,
  };
}

function collectChartEvidence({ pair, timeframe, chartAssets = [] } = {}) {
  const assets = Array.isArray(chartAssets) ? chartAssets : [chartAssets];
  return assets
    .map((asset) => normalizeChartAsset(asset, { pair, timeframe }))
    .filter(Boolean);
}

function ensureChartEvidence({ pair, timeframe, candles = [], chartAssets = [] } = {}) {
  const evidence = collectChartEvidence({ pair, timeframe, chartAssets });
  if (evidence.length > 0) {
    return evidence;
  }

  return [normalizeChartAsset(createGeneratedChartEvidence({ pair, timeframe, candles }), { pair, timeframe })].filter(Boolean);
}

module.exports = {
  normalizeChartAsset,
  collectChartEvidence,
  ensureChartEvidence,
};
