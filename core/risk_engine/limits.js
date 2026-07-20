function getRiskLimits() {
  return {
    maxRiskPerTrade: 0.01,
    maxOpenTrades: 5,
    status: 'placeholder',
  };
}

module.exports = {
  getRiskLimits,
};
