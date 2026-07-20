function calculateStatistics({ trades = [] } = {}) {
  const wins = trades.filter((trade) => Boolean(trade.win)).length;
  const losses = trades.length - wins;
  const grossWin = trades.filter((trade) => Number(trade.pnl) > 0).reduce((sum, trade) => sum + Number(trade.pnl), 0);
  const grossLoss = Math.abs(trades.filter((trade) => Number(trade.pnl) < 0).reduce((sum, trade) => sum + Number(trade.pnl), 0));

  return {
    trades: trades.length,
    wins,
    losses,
    winRate: trades.length > 0 ? Number((wins / trades.length).toFixed(4)) : 0,
    profitFactor: grossLoss > 0 ? Number((grossWin / grossLoss).toFixed(4)) : grossWin > 0 ? Infinity : 0,
    status: 'ready',
  };
}

module.exports = {
  calculateStatistics,
};
