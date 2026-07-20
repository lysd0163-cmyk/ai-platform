function assessRisk({ accountSize = 0, stopLoss = 0, takeProfit = 0, riskPercent = 1, maxRiskPerTrade = 1 } = {}) {
  const safeAccountSize = Number(accountSize) || 0;
  const safeStopLoss = Number(stopLoss) || 0;
  const safeTakeProfit = Number(takeProfit) || 0;
  const safeRiskPercent = Math.min(Math.max(Number(riskPercent) || 0, 0), Number(maxRiskPerTrade) || 1);
  const riskReward = safeStopLoss > 0 ? safeTakeProfit / safeStopLoss : null;
  const riskAmount = safeAccountSize * (safeRiskPercent / 100);
  const positionSize = safeStopLoss > 0 ? riskAmount / safeStopLoss : 0;

  return {
    ok: riskReward === null ? false : riskReward >= 1,
    riskReward,
    accountSize: safeAccountSize,
    stopLoss: safeStopLoss,
    takeProfit: safeTakeProfit,
    riskPercent: safeRiskPercent,
    riskAmount: Number(riskAmount.toFixed(2)),
    positionSize: Number(positionSize.toFixed(4)),
  };
}

function evaluatePortfolioRisk({ openTrades = 0, maxOpenTrades = 5, dailyLoss = 0, dailyLossLimit = 0 } = {}) {
  const tradeLimitReached = Number(openTrades) >= Number(maxOpenTrades);
  const lossLimitReached = dailyLossLimit > 0 && Number(dailyLoss) >= Number(dailyLossLimit);

  return {
    ok: !tradeLimitReached && !lossLimitReached,
    openTrades: Number(openTrades) || 0,
    maxOpenTrades: Number(maxOpenTrades) || 0,
    dailyLoss: Number(dailyLoss) || 0,
    dailyLossLimit: Number(dailyLossLimit) || 0,
    tradeLimitReached,
    lossLimitReached,
    status: tradeLimitReached || lossLimitReached ? 'blocked' : 'ready',
  };
}

module.exports = {
  assessRisk,
  evaluatePortfolioRisk,
};
