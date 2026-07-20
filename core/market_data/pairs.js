const DEFAULT_PAIRS = ['EURUSD', 'GBPUSD', 'USDJPY', 'AUDUSD'];

function getDefaultPairs() {
  return DEFAULT_PAIRS.slice();
}

module.exports = {
  DEFAULT_PAIRS,
  getDefaultPairs,
};
