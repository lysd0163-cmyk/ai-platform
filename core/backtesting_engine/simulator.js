function simulateBacktest({ strategy = null, history = [], signals = [] } = {}) {
  const trades = signals.map((signal, index) => {
    const entry = Number(signal.entry ?? signal.price ?? 0);
    const exit = Number(signal.exit ?? signal.target ?? entry);
    const direction = String(signal.side || signal.direction || 'buy').toLowerCase();
    const pnl = direction === 'sell' ? entry - exit : exit - entry;
    return {
      id: signal.id || `trade-${index + 1}`,
      symbol: signal.symbol || signal.pair || 'UNKNOWN',
      direction,
      entry,
      exit,
      pnl,
      win: pnl > 0,
      startedAt: signal.startedAt || null,
      closedAt: signal.closedAt || null,
    };
  });

  const wins = trades.filter((trade) => trade.win).length;
  const losses = trades.length - wins;
  const grossWin = trades.filter((trade) => trade.pnl > 0).reduce((sum, trade) => sum + trade.pnl, 0);
  const grossLoss = Math.abs(trades.filter((trade) => trade.pnl < 0).reduce((sum, trade) => sum + trade.pnl, 0));

  return {
    strategy,
    history,
    status: 'complete',
    trades,
    summary: {
      totalTrades: trades.length,
      wins,
      losses,
      winRate: trades.length > 0 ? Number((wins / trades.length).toFixed(4)) : 0,
      profitFactor: grossLoss > 0 ? Number((grossWin / grossLoss).toFixed(4)) : grossWin > 0 ? Infinity : 0,
    },
  };
}

module.exports = {
  simulateBacktest,
};
