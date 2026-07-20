function validateCandles(candles = [], limit = 500) {
  const issues = [];
  if (!Array.isArray(candles)) {
    return { valid: false, issues: ['candles-not-array'] };
  }

  if (candles.length === 0) {
    issues.push('candles-empty');
  }

  if (candles.length > limit) {
    issues.push('candles-exceed-limit');
  }

  const invalidCount = candles.filter((candle) => !candle || !Number.isFinite(Number(candle.open)) || !Number.isFinite(Number(candle.high)) || !Number.isFinite(Number(candle.low)) || !Number.isFinite(Number(candle.close))).length;
  if (invalidCount > 0) {
    issues.push('invalid-candles-present');
  }

  return {
    valid: issues.length === 0,
    issues,
    count: candles.length,
    expectedCount: limit,
  };
}

function validateChartEvidence(chartEvidence = []) {
  const issues = [];
  if (!Array.isArray(chartEvidence)) {
    return { valid: false, issues: ['chart-evidence-not-array'] };
  }

  if (chartEvidence.length === 0) {
    issues.push('chart-evidence-missing');
  }

  return {
    valid: issues.length === 0,
    issues,
    count: chartEvidence.length,
  };
}

function validateAcquisitionSnapshot(snapshot = {}) {
  const candleValidation = validateCandles(snapshot.candles || [], snapshot.limit || 500);
  const chartValidation = validateChartEvidence(snapshot.chartEvidence || []);
  const issues = [...candleValidation.issues, ...chartValidation.issues];

  return {
    valid: issues.length === 0,
    issues,
    candleValidation,
    chartValidation,
    status: issues.length === 0 ? 'ready' : 'needs-review',
  };
}

module.exports = {
  validateCandles,
  validateChartEvidence,
  validateAcquisitionSnapshot,
};
