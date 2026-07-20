function loadStrategyDefinition(source = {}) {
  return {
    source,
    loadedAt: new Date().toISOString(),
    status: 'placeholder',
  };
}

module.exports = {
  loadStrategyDefinition,
};
