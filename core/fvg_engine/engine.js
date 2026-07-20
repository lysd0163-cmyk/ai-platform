function runFvgEngine({ marketSnapshot } = {}) {
  return {
    marketSnapshot,
    status: 'placeholder',
    gaps: [],
  };
}

module.exports = {
  runFvgEngine,
};
