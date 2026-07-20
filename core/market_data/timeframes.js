const TIMEFRAMES = ['D1', 'H4', 'H1', 'M15'];

function getTimeframes() {
  return TIMEFRAMES.slice();
}

module.exports = {
  TIMEFRAMES,
  getTimeframes,
};
