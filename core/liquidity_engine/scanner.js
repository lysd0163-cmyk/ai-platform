function scanLiquidity({ candles = [] } = {}) {
  return {
    candles,
    status: 'placeholder',
    sweeps: [],
  };
}

module.exports = {
  scanLiquidity,
};
