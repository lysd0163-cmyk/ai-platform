function detectBos({ candles = [] } = {}) {
  return {
    candles,
    status: 'placeholder',
    bos: false,
  };
}

module.exports = {
  detectBos,
};
