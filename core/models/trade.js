function createTrade({ symbol, side, entry, stopLoss, takeProfit } = {}) {
  return {
    id: `${symbol || 'TRADE'}-${Date.now()}`,
    symbol,
    side,
    entry,
    stopLoss,
    takeProfit,
    status: 'pending',
    createdAt: new Date().toISOString(),
  };
}

module.exports = {
  createTrade,
};
