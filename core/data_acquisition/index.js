const { trimCandleWindow, normalizeCandles } = require('./window');
const { normalizeChartAsset, collectChartEvidence } = require('./charts');
const { acquirePairTimeframeData, acquireMarketPackage } = require('./engine');
const { createAcquisitionLoop } = require('./loop');

module.exports = {
  trimCandleWindow,
  normalizeCandles,
  normalizeChartAsset,
  collectChartEvidence,
  acquirePairTimeframeData,
  acquireMarketPackage,
  createAcquisitionLoop,
};
