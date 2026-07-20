function simulateBacktest({ strategy = null, history = [] } = {}) {
  return {
    strategy,
    history,
    status: 'placeholder',
    trades: [],
    summary: {
      totalTrades: 0,
      winRate: 0,
      profitFactor: 0,
    },
  };
}

module.exports = {
  simulateBacktest,
};
