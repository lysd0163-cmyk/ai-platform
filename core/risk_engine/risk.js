function assessRisk({ accountSize = 0, stopLoss = 0, takeProfit = 0 } = {}) {
  const riskReward = stopLoss > 0 ? takeProfit / stopLoss : null;
  return {
    ok: riskReward === null ? false : riskReward >= 1,
    riskReward,
    accountSize,
    stopLoss,
    takeProfit,
  };
}

module.exports = {
  assessRisk,
};
