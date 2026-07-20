const { trimCandleWindow, normalizeCandles } = require('./window');
const { normalizeChartAsset, collectChartEvidence } = require('./charts');
const { createDataProvider } = require('./provider');
const { createAcquisitionCache } = require('./cache');
const { validateCandles, validateChartEvidence, validateAcquisitionSnapshot } = require('./validator');
const { chooseLatestTimestamp, synchronizeAcquisition } = require('./sync');
const { withRetry } = require('./retry');
const { acquirePairTimeframeData, acquireMarketPackage } = require('./engine');
const { createAcquisitionLoop } = require('./loop');

module.exports = {
  trimCandleWindow,
  normalizeCandles,
  normalizeChartAsset,
  collectChartEvidence,
  createDataProvider,
  createAcquisitionCache,
  validateCandles,
  validateChartEvidence,
  validateAcquisitionSnapshot,
  chooseLatestTimestamp,
  synchronizeAcquisition,
  withRetry,
  acquirePairTimeframeData,
  acquireMarketPackage,
  createAcquisitionLoop,
};
