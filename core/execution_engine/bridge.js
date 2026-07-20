function submitExecutionOrder(order = {}) {
  const symbol = order.symbol || order.pair || null;
  const side = String(order.side || '').toLowerCase();
  return {
    id: `${symbol || 'order'}-${Date.now()}`,
    symbol,
    side,
    entry: Number(order.entry),
    stopLoss: Number(order.stopLoss ?? order.sl),
    takeProfit: Number(order.takeProfit ?? order.tp),
    volume: Number(order.volume ?? 0),
    status: 'queued',
    venue: order.venue || 'MetaTrader',
    submittedAt: new Date().toISOString(),
  };
}

module.exports = {
  submitExecutionOrder,
};
