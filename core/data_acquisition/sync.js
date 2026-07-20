function chooseLatestTimestamp(candles = [], chartEvidence = []) {
  const candleTimes = candles
    .map((candle) => candle?.time || candle?.timestamp || null)
    .filter(Boolean)
    .map((value) => new Date(value).getTime())
    .filter(Number.isFinite);

  const chartTimes = chartEvidence
    .map((item) => item?.capturedAt || item?.timestamp || null)
    .filter(Boolean)
    .map((value) => new Date(value).getTime())
    .filter(Number.isFinite);

  const timestamps = [...candleTimes, ...chartTimes];
  if (timestamps.length === 0) {
    return null;
  }

  return new Date(Math.max(...timestamps)).toISOString();
}

function synchronizeAcquisition({ pair, timeframe, candles = [], chartEvidence = [], limit = 500, source = 'unknown' } = {}) {
  const acquisitionTimestamp = chooseLatestTimestamp(candles, chartEvidence) || new Date().toISOString();
  return {
    pair,
    timeframe,
    candles,
    chartEvidence,
    candleCount: candles.length,
    chartEvidenceCount: chartEvidence.length,
    limit,
    source,
    acquisitionTimestamp,
    status: candles.length > 0 && chartEvidence.length > 0 ? 'synchronized' : 'partial',
  };
}

module.exports = {
  chooseLatestTimestamp,
  synchronizeAcquisition,
};
