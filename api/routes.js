function getRoutes() {
  return [
    { path: '/health', method: 'GET' },
    { path: '/status', method: 'GET' },
  ];
}

module.exports = {
  getRoutes,
};
