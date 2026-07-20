function renderDashboardView(state = {}) {
  return {
    title: 'AI Platform Dashboard',
    state,
    renderedAt: new Date().toISOString(),
  };
}

module.exports = {
  renderDashboardView,
};
