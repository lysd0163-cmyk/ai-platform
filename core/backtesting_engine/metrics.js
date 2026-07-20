function calculateMetrics(results = []) {
  return {
    trades: results.length,
    winRate: 0,
    profitFactor: 0,
    status: 'placeholder',
  };
}

module.exports = {
  calculateMetrics,
};
