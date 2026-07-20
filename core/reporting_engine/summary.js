function createSummary({ pair, outcome, reasons = [] } = {}) {
  return {
    pair,
    outcome,
    reasons,
    generatedAt: new Date().toISOString(),
  };
}

module.exports = {
  createSummary,
};
