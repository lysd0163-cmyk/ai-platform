function buildOrderPayload({ symbol, side, volume, stopLoss, takeProfit } = {}) {
  return {
    symbol,
    side,
    volume,
    stopLoss,
    takeProfit,
    platform: 'MetaTrader',
    status: 'not_connected',
  };
}

module.exports = {
  buildOrderPayload,
};
