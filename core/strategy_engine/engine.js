function runStrategy({ marketSnapshot, rules } = {}) {
  return {
    marketSnapshot,
    rules,
    status: 'placeholder',
    zones: [],
  };
}

module.exports = {
  runStrategy,
};
