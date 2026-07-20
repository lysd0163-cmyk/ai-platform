const { scanLiquidity } = require('./scanner');
const { resolveLiquidity } = require('./resolver');

function runLiquidityEngine({ marketSnapshot } = {}) {
  const candles = Array.isArray(marketSnapshot?.candles) ? marketSnapshot.candles : [];
  const scanned = scanLiquidity({ candles });
  const resolved = resolveLiquidity({ scanned });

  return {
    marketSnapshot,
    scanned,
    resolved,
    status: resolved.resolved ? 'ready' : 'watching',
  };
}

module.exports = {
  runLiquidityEngine,
};
