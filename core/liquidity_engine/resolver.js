function resolveLiquidity({ signals = [], scanned = null } = {}) {
  const sweeps = scanned?.sweeps || signals.filter((signal) => signal?.side);
  const bias = scanned?.bias || (sweeps.some((sweep) => sweep.side === 'buy-side') ? 'bullish' : sweeps.some((sweep) => sweep.side === 'sell-side') ? 'bearish' : 'neutral');

  return {
    signals,
    scanned,
    bias,
    sweeps,
    resolved: sweeps.length > 0,
    status: sweeps.length > 0 ? 'resolved' : 'unresolved',
  };
}

module.exports = {
  resolveLiquidity,
};
