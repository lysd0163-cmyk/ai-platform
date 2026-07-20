function createDashboardState() {
  return {
    running: false,
    pairCount: 0,
    lastUpdated: new Date().toISOString(),
  };
}

module.exports = {
  createDashboardState,
};
