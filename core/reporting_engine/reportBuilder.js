function buildReport(data = {}) {
  return {
    ...data,
    builtAt: new Date().toISOString(),
    status: 'placeholder',
  };
}

module.exports = {
  buildReport,
};
