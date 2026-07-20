const { runStrategyPipeline } = require('../strategy_engine');
const { assembleMarketSnapshot } = require('../market_data/assembler');
const { fetchMarketData } = require('../market_data/fetcher');
const { runAnalysis } = require('../analysis');
const { buildInstitutionalZones } = require('../zone_engine');
const { createMonitoringState } = require('../monitoring_engine/state');
const { runMonitoringLoop } = require('../monitoring_engine/loop');
const { validateExecutionOrder } = require('../execution_engine/validator');
const { submitExecutionOrder } = require('../execution_engine/bridge');
const { simulateBacktest } = require('../backtesting_engine/simulator');
const { calculateStatistics } = require('../reporting_engine/statistics');

function deriveExecutionOrder(pair, zone, side) {
  if (!zone) {
    return null;
  }

  const entry = Number(zone.bottom + (zone.width / 2));
  const stopLoss = side === 'buy' ? zone.bottom : zone.top;
  const takeProfit = side === 'buy' ? zone.top + zone.width * 2 : zone.bottom - zone.width * 2;

  return {
    symbol: pair,
    side,
    entry: Number(entry.toFixed(5)),
    stopLoss: Number(stopLoss.toFixed(5)),
    takeProfit: Number(takeProfit.toFixed(5)),
    volume: 0.01,
  };
}

function createSnapshotsForPair(pair, timeframes = [], marketData = {}) {
  return timeframes.map((timeframe) => {
    const source = marketData?.[pair]?.[timeframe] || {};
    const fetched = fetchMarketData({
      pair,
      timeframe,
      candles: Array.isArray(source.candles) ? source.candles : [],
      source: source.source || 'placeholder',
    });

    return assembleMarketSnapshot({
      pair,
      timeframe,
      candles: fetched.candles,
      source: fetched.source,
    });
  });
}

function startOrchestrator({ strategyInput = null, pairs = [], timeframes = ['D1', 'H4', 'H1', 'M15'], marketData = {} } = {}) {
  const strategyPipeline = runStrategyPipeline(strategyInput || {});

  const pairRuns = pairs.map((pair) => {
    const snapshots = createSnapshotsForPair(pair, timeframes, marketData);
    const analysis = runAnalysis({
      pair,
      timeframes,
      marketSnapshots: snapshots,
      compiledRules: strategyPipeline.compiled.rules,
      strategy: strategyPipeline.compiled,
    });
    const zones = buildInstitutionalZones({ analysis });
    const monitoringState = createMonitoringState({
      pair,
      timeframes,
      zones: [zones.buyZone, zones.sellZone].filter(Boolean),
    });
    const monitoring = runMonitoringLoop({
      pair,
      zones: [zones.buyZone, zones.sellZone].filter(Boolean),
      latestSnapshot: snapshots[snapshots.length - 1] || null,
      previousState: monitoringState,
    });
    const executionOrder = deriveExecutionOrder(pair, zones.selectedZone, zones.selectedSide);
    const validation = executionOrder ? validateExecutionOrder(executionOrder) : { valid: false, issues: ['zone-missing'], status: 'blocked' };
    const transportOrder = validation.valid ? submitExecutionOrder(executionOrder) : null;

    return {
      pair,
      timeframes,
      snapshots,
      analysis,
      zones,
      monitoring,
      execution: {
        executionOrder,
        validation,
        transportOrder,
      },
    };
  });

  const signals = pairRuns
    .filter((run) => Boolean(run.execution.transportOrder))
    .map((run) => ({
      id: run.execution.transportOrder.id,
      symbol: run.pair,
      side: run.execution.transportOrder.side,
      entry: run.execution.transportOrder.entry,
      target: run.execution.transportOrder.takeProfit,
      startedAt: run.execution.transportOrder.submittedAt,
      closedAt: null,
    }));

  const backtest = simulateBacktest({
    strategy: strategyPipeline.compiled,
    history: pairRuns,
    signals,
  });
  const statistics = calculateStatistics({ trades: backtest.trades });

  return {
    status: 'ready',
    strategyPipeline,
    pairRuns,
    backtest,
    statistics,
    generatedAt: new Date().toISOString(),
  };
}

module.exports = {
  deriveExecutionOrder,
  createSnapshotsForPair,
  startOrchestrator,
};
