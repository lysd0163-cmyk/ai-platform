function resolveLiquidity({ signals = [] } = {}) {
  return {
    signals,
    status: 'placeholder',
    resolved: signals.length > 0,
  };
}

module.exports = {
  resolveLiquidity,
};
