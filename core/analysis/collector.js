function collectAnalysisInputs({ pair, timeframes = [], marketData = [] } = {}) {
  return {
    pair,
    timeframes,
    marketData,
    collectedAt: new Date().toISOString(),
  };
}

module.exports = {
  collectAnalysisInputs,
};
