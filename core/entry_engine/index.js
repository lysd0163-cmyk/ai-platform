function getM15Candles(snapshots = []) {
  const m15 = snapshots.find((snapshot) => snapshot?.timeframe === 'M15');
  return Array.isArray(m15?.candles) ? m15.candles : [];
}

function detectBreakCloseRetestConfirm({ zone = null, side = 'buy', candles = [] } = {}) {
  if (!zone || !Array.isArray(candles) || candles.length < 4) {
    return {
      passed: false,
      phase: 'insufficient-data',
      reason: 'Not enough M15 data for entry confirmation',
      sequence: [],
    };
  }

  const top = Number(zone.top);
  const bottom = Number(zone.bottom);
  const seq = candles.slice(-4);
  const [c1, c2, c3, c4] = seq;

  const close1 = Number(c1.close);
  const close2 = Number(c2.close);
  const close3 = Number(c3.close);
  const close4 = Number(c4.close);

  if (side === 'buy') {
    const breakAndClose = close2 > top && close1 <= top;
    const retest = Number(c3.low) <= top && close3 >= top;
    const confirm = close4 > Number(c4.open);

    return {
      passed: breakAndClose && retest && confirm,
      phase: confirm ? 'confirmation' : retest ? 'retest' : breakAndClose ? 'break-close' : 'waiting',
      reason: breakAndClose && retest && confirm ? 'Buy entry sequence complete' : 'Buy entry sequence incomplete',
      sequence: {
        breakAndClose,
        retest,
        confirm,
        closes: [close1, close2, close3, close4],
      },
    };
  }

  const breakAndClose = close2 < bottom && close1 >= bottom;
  const retest = Number(c3.high) >= bottom && close3 <= bottom;
  const confirm = close4 < Number(c4.open);

  return {
    passed: breakAndClose && retest && confirm,
    phase: confirm ? 'confirmation' : retest ? 'retest' : breakAndClose ? 'break-close' : 'waiting',
    reason: breakAndClose && retest && confirm ? 'Sell entry sequence complete' : 'Sell entry sequence incomplete',
    sequence: {
      breakAndClose,
      retest,
      confirm,
      closes: [close1, close2, close3, close4],
    },
  };
}

function evaluateEntry({ zone = null, side = 'buy', snapshots = [] } = {}) {
  const candles = getM15Candles(snapshots);
  return detectBreakCloseRetestConfirm({ zone, side, candles });
}

module.exports = {
  getM15Candles,
  detectBreakCloseRetestConfirm,
  evaluateEntry,
};
