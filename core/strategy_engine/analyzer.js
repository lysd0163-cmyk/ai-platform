function analyzeStrategy({ snapshot, compiledRules = [] } = {}) {
  return {
    snapshot,
    compiledRules,
    status: 'placeholder',
    result: {
      buyZone: null,
      sellZone: null,
    },
  };
}

module.exports = {
  analyzeStrategy,
};
