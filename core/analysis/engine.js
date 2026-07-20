function runAnalysis({ pair, timeframes = [], marketSnapshots = [], compiledRules = [] } = {}) {
  return {
    pair,
    timeframes,
    marketSnapshots,
    compiledRules,
    status: 'placeholder',
    result: {
      buyZone: null,
      sellZone: null,
      reasons: [],
    },
  };
}

module.exports = {
  runAnalysis,
};
