function runMonitoringLoop(state = {}) {
  return {
    ...state,
    status: 'placeholder',
    tickAt: new Date().toISOString(),
  };
}

module.exports = {
  runMonitoringLoop,
};
