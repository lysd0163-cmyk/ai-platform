function detectChoch({ candles = [] } = {}) {
  return {
    candles,
    status: 'placeholder',
    choch: false,
  };
}

module.exports = {
  detectChoch,
};
