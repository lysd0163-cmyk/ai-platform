function buildExecutionOrder({ symbol, side, entry, stopLoss, takeProfit } = {}) {
  return {
    symbol,
    side,
    entry,
    stopLoss,
    takeProfit,
    status: 'built',
    createdAt: new Date().toISOString(),
  };
}

module.exports = {
  buildExecutionOrder,
};
