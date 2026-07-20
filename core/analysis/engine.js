const { evaluateLayers } = require('./layers');
const { buildCandidateZones, rankZone } = require('./zones');
const { intersectLayers } = require('./intersection');
const { scoreAnalysis } = require('./scorer');
const { buildAnalysisReport } = require('./reporter');

function choosePrimarySide({ premiumDiscount, structure, momentum, liquidity, orderBlock, fvg }) {
  const buyVotes = [
    premiumDiscount?.bias === 'discount',
    structure?.bullishStructure === true,
    momentum?.direction === 'buy',
    liquidity?.bias?.startsWith('bullish'),
    orderBlock?.direction === 'buy',
    fvg?.direction === 'buy',
  ].filter(Boolean).length;

  const sellVotes = [
    premiumDiscount?.bias === 'premium',
    structure?.bearishStructure === true,
    momentum?.direction === 'sell',
    liquidity?.bias?.startsWith('bearish'),
    orderBlock?.direction === 'sell',
    fvg?.direction === 'sell',
  ].filter(Boolean).length;

  if (buyVotes > sellVotes) {
    return 'buy';
  }

  if (sellVotes > buyVotes) {
    return 'sell';
  }

  if (premiumDiscount?.bias === 'discount' && (structure?.bullishStructure || momentum?.direction === 'buy')) {
    return 'buy';
  }

  if (premiumDiscount?.bias === 'premium' && (structure?.bearishStructure || momentum?.direction === 'sell')) {
    return 'sell';
  }

  if (structure?.bullishStructure && !structure?.bearishStructure) {
    return 'buy';
  }

  if (structure?.bearishStructure && !structure?.bullishStructure) {
    return 'sell';
  }

  return momentum?.direction === 'sell' ? 'sell' : 'buy';
}

function runAnalysis({ pair, timeframes = [], marketSnapshots = [], compiledRules = [], strategy = null } = {}) {
  const analysis = evaluateLayers({ timeframes, marketSnapshots, compiledRules, strategy });
  const intersection = intersectLayers(analysis.layers);
  const score = scoreAnalysis({ layers: analysis.layers, intersection });
  const candidateZones = buildCandidateZones({
    candles: analysis.candles,
    range: analysis.range,
    trend: analysis.trend,
    bias: analysis.signals.premiumDiscount?.bias,
    signals: analysis.signals,
  });

  const buyZone = rankZone(candidateZones.buyZone, analysis);
  const sellZone = rankZone(candidateZones.sellZone, analysis);
  const primarySide = choosePrimarySide({
    premiumDiscount: analysis.signals.premiumDiscount,
    structure: analysis.signals.structure,
    momentum: analysis.signals.momentum,
    liquidity: analysis.signals.liquidity,
    orderBlock: analysis.signals.orderBlock,
    fvg: analysis.signals.fvg,
  });
  const selectedZone = primarySide === 'buy' ? buyZone : sellZone;

  const report = buildAnalysisReport({
    pair,
    timeframes,
    strategy,
    analysis,
    score,
    intersection,
    zones: {
      buyZone,
      sellZone,
      selectedSide: primarySide,
      selectedZone,
    },
  });

  return {
    pair,
    timeframes,
    strategy,
    status: intersection.valid ? 'complete' : 'needs-review',
    analysis,
    intersection,
    score,
    candidates: candidateZones,
    zones: {
      buyZone,
      sellZone,
      selectedSide: primarySide,
      selectedZone,
    },
    report,
    reasons: intersection.reasons,
  };
}

module.exports = {
  choosePrimarySide,
  runAnalysis,
};
