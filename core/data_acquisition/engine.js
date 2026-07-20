const { trimCandleWindow } = require('./window');
const { collectChartEvidence } = require('./charts');

function acquirePairTimeframeData({ pair, timeframe, source = {}, chartAssets = [], limit = 500 } = {}) {
  const window = trimCandleWindow(Array.isArray(source.candles) ? source.candles : [], limit);
  const chartEvidence = collectChartEvidence({ pair, timeframe, chartAssets: chartAssets.length ? chartAssets : source.chartAssets || source.chartImages || source.chartImage ? [source.chartImage || source.chartImages || source.chartAssets].flat() : [] });

  return {
    pair,
    timeframe,
    limit: window.limit,
    candles: window.candles,
    candleCount: window.candleCount,
    range: window.range,
    chartEvidence,
    source: source.source || 'unknown',
    status: window.status,
    acquiredAt: new Date().toISOString(),
  };
}

function acquireMarketPackage({ pairs = [], timeframes = [], marketData = {}, chartData = {}, limit = 500 } = {}) {
  const packageByPair = pairs.map((pair) => {
    const pairSnapshots = timeframes.map((timeframe) => {
      const source = marketData?.[pair]?.[timeframe] || {};
      const chartAssets = chartData?.[pair]?.[timeframe] || source.chartAssets || source.chartImages || (source.chartImage ? [source.chartImage] : []);
      return acquirePairTimeframeData({ pair, timeframe, source, chartAssets, limit });
    });

    return {
      pair,
      timeframes: pairSnapshots,
      totalCandles: pairSnapshots.reduce((sum, snapshot) => sum + snapshot.candleCount, 0),
      chartEvidenceCount: pairSnapshots.reduce((sum, snapshot) => sum + snapshot.chartEvidence.length, 0),
      acquiredAt: new Date().toISOString(),
    };
  });

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
  acquirePairTimeframeData,
  acquireMarketPackage,
};
