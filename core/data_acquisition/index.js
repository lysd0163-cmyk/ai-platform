const { trimCandleWindow, normalizeCandles } = require('./window');
const { normalizeChartAsset, collectChartEvidence, ensureChartEvidence } = require('./charts');
const { createGeneratedChartEvidence } = require('./generated_chart');
const { createDataProvider } = require('./provider');
const { createTwelveDataProvider, normalizePairSymbol, mapTimeframeToInterval } = require('./twelvedata');
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
  ensureChartEvidence,
  createGeneratedChartEvidence,
  createDataProvider,
  createTwelveDataProvider,
  normalizePairSymbol,
  mapTimeframeToInterval,
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
