function normalizeChartAsset(asset = {}, fallback = {}) {
  const url = asset.url || asset.imageUrl || asset.chartUrl || null;
  const path = asset.path || asset.imagePath || asset.chartPath || null;

  if (!url && !path && !asset.base64 && !asset.buffer && !asset.caption) {
    return null;
  }

  return {
    pair: asset.pair || fallback.pair || null,
    timeframe: asset.timeframe || fallback.timeframe || null,
    url,
    path,
    caption: asset.caption || fallback.caption || null,
    source: asset.source || fallback.source || 'unknown',
    capturedAt: asset.capturedAt || asset.timestamp || new Date().toISOString(),
    evidence: Boolean(url || path || asset.base64 || asset.buffer),
  };
}

function collectChartEvidence({ pair, timeframe, chartAssets = [] } = {}) {
  const assets = Array.isArray(chartAssets) ? chartAssets : [chartAssets];
  return assets
    .map((asset) => normalizeChartAsset(asset, { pair, timeframe }))
    .filter(Boolean);
}

module.exports = {
  normalizeChartAsset,
  collectChartEvidence,
};
