function buildAnalysisReport({ pair, analysis, score } = {}) {
  return {
    pair,
    analysis,
    score,
    generatedAt: new Date().toISOString(),
    status: 'placeholder',
  };
}

module.exports = {
  buildAnalysisReport,
};
