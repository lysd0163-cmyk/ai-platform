function calculateStatistics({ trades = [] } = {}) {
  return {
    trades: trades.length,
    wins: 0,
    losses: 0,
    winRate: 0,
    status: 'placeholder',
  };
}

module.exports = {
  calculateStatistics,
};
