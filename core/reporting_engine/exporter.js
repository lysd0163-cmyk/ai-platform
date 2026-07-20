function exportReport(report = {}) {
  return {
    ...report,
    exportedAt: new Date().toISOString(),
    status: 'placeholder',
  };
}

module.exports = {
  exportReport,
};
