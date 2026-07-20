function buildAnalysisReport({ pair, timeframes = [], strategy = null, analysis = null, score = null, intersection = null, zones = null } = {}) {
  const reasons = Array.isArray(intersection?.reasons) ? intersection.reasons : [];
  return {
    pair,
    timeframes,
    strategy: strategy ? {
      name: strategy.strategyName || strategy.name || 'Unnamed Strategy',
      version: strategy.version || 'unknown',
    } : null,
    score,
    intersection,
    zones,
    analysisSummary: analysis
      ? {
          candleCount: analysis.candles?.length || 0,
          trend: analysis.trend || 'neutral',
          range: analysis.range || null,
          layerCount: analysis.layers?.length || 0,
        }
      : null,
    reasons,
    generatedAt: new Date().toISOString(),
    status: reasons.length > 0 ? 'review' : 'ready',
  };
}

module.exports = {
  buildAnalysisReport,
};
