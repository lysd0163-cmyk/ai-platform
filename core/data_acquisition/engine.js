const { trimCandleWindow } = require('./window');
const { collectChartEvidence, ensureChartEvidence } = require('./charts');
const { createDataProvider } = require('./provider');
const { createAcquisitionCache } = require('./cache');
const { validateAcquisitionSnapshot } = require('./validator');
const { synchronizeAcquisition } = require('./sync');
const { withRetry } = require('./retry');

function resolveChartAssets({ source = {}, chartAssets = [] } = {}) {
  if (Array.isArray(chartAssets) && chartAssets.length > 0) {
    return chartAssets;
  }

  if (Array.isArray(source.chartAssets) && source.chartAssets.length > 0) {
    return source.chartAssets;
  }

  if (Array.isArray(source.chartImages) && source.chartImages.length > 0) {
    return source.chartImages;
  }

  if (source.chartImage) {
    return [source.chartImage];
  }

  return [];
}

async function acquirePairTimeframeData({
  pair,
  timeframe,
  source = {},
  chartAssets = [],
  limit = 500,
  provider = null,
  cache = null,
  retries = 2,
} = {}) {
  const dataProvider = provider || createDataProvider();
  const acquisitionCache = cache || createAcquisitionCache();
  const cacheKey = `${pair || 'UNKNOWN'}::${timeframe || 'NA'}`;

  const cached = acquisitionCache.get(pair, timeframe, 'snapshot');
  if (cached) {
    return cached;
  }

  const candles = await withRetry(async () => dataProvider.fetchCandles({ pair, timeframe, source, limit }), { retries });
  const charts = await withRetry(async () => dataProvider.fetchCharts({ pair, timeframe, source }), { retries });
  const candlesWindow = trimCandleWindow(Array.isArray(candles) ? candles : source.candles || [], limit);
  const externalChartEvidence = collectChartEvidence({ pair, timeframe, chartAssets: resolveChartAssets({ source, chartAssets: Array.isArray(charts) ? charts : [] }) });
  const chartEvidence = externalChartEvidence.length > 0
    ? externalChartEvidence
    : ensureChartEvidence({ pair, timeframe, candles: candlesWindow.candles, chartAssets: [] });
  const synchronized = synchronizeAcquisition({
    pair,
    timeframe,
    candles: candlesWindow.candles,
    chartEvidence,
    limit: candlesWindow.limit,
    source: source.source || 'unknown',
  });
  const validation = validateAcquisitionSnapshot({
    ...synchronized,
    limit: candlesWindow.limit,
  });

  const snapshot = {
    pair,
    timeframe,
    limit: candlesWindow.limit,
    candles: candlesWindow.candles,
    candleCount: candlesWindow.candleCount,
    range: candlesWindow.range,
    chartEvidence,
    source: source.source || 'unknown',
    status: validation.valid ? 'ready' : 'needs-review',
    validation,
    acquisitionTimestamp: synchronized.acquisitionTimestamp,
    acquiredAt: new Date().toISOString(),
  };

  acquisitionCache.set(pair, timeframe, 'snapshot', snapshot);
  acquisitionCache.set(pair, timeframe, 'key', cacheKey);
  return snapshot;
}

async function acquireMarketPackage({
  pairs = [],
  timeframes = [],
  marketData = {},
  chartData = {},
  limit = 500,
  provider = null,
  cache = null,
  retries = 2,
} = {}) {
  const dataProvider = provider || createDataProvider();
  const acquisitionCache = cache || createAcquisitionCache();
  const packageByPair = [];

  for (const pair of pairs) {
    const pairSnapshots = [];
    for (const timeframe of timeframes) {
      const source = marketData?.[pair]?.[timeframe] || {};
      const chartAssets = chartData?.[pair]?.[timeframe] || source.chartAssets || source.chartImages || (source.chartImage ? [source.chartImage] : []);
      const snapshot = await acquirePairTimeframeData({
        pair,
        timeframe,
        source,
        chartAssets,
        limit,
        provider: dataProvider,
        cache: acquisitionCache,
        retries,
      });
      pairSnapshots.push(snapshot);
    }

    const totalCandles = pairSnapshots.reduce((sum, snapshot) => sum + snapshot.candleCount, 0);
    const chartEvidenceCount = pairSnapshots.reduce((sum, snapshot) => sum + snapshot.chartEvidence.length, 0);
    const allValidated = pairSnapshots.every((snapshot) => snapshot.validation?.valid);

    packageByPair.push({
      pair,
      timeframes: pairSnapshots,
      totalCandles,
      chartEvidenceCount,
      validated: allValidated,
      acquiredAt: new Date().toISOString(),
    });
  }

  return {
    pairs,
    timeframes,
    limit,
    packageByPair,
    status: 'ready',
    acquiredAt: new Date().toISOString(),
  };
}

module.exports = {
  resolveChartAssets,
  acquirePairTimeframeData,
  acquireMarketPackage,
};
