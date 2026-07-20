function runOrderBlockEngine({ marketSnapshot } = {}) {
  return {
    marketSnapshot,
    status: 'placeholder',
    orderBlocks: [],
  };
}

module.exports = {
  runOrderBlockEngine,
};
