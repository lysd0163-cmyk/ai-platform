const { runStrategyPipeline } = require('../strategy_engine');
const { getDefaultPairs } = require('../market_data/pairs');
const { getTimeframes } = require('../market_data/timeframes');
const { acquireMarketPackage } = require('../data_acquisition');
const { runAnalysis } = require('../analysis');
const { buildInstitutionalZones } = require('../zone_engine');
const { createMonitoringState } = require('../monitoring_engine/state');
const { runMonitoringLoop } = require('../monitoring_engine/loop');
const { evaluateEntry } = require('../entry_engine');
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

function startOrchestrator({ strategyInput = null, pairs = null, timeframes = null, marketData = {}, chartData = {}, candleLimit = 500 } = {}) {
  const effectivePairs = Array.isArray(pairs) && pairs.length > 0 ? pairs : getDefaultPairs();
  const effectiveTimeframes = Array.isArray(timeframes) && timeframes.length > 0 ? timeframes : getTimeframes();
  const strategyPipeline = runStrategyPipeline(strategyInput || {});
  const acquisition = acquireMarketPackage({
    pairs: effectivePairs,
    timeframes: effectiveTimeframes,
    marketData,
    chartData,
    limit: candleLimit,
  });

  const pairRuns = acquisition.packageByPair.map((pairPackage) => {
    const pair = pairPackage.pair;
    const snapshots = pairPackage.timeframes;
    const analysis = runAnalysis({
      pair,
      timeframes: effectiveTimeframes,
      marketSnapshots: snapshots,
      compiledRules: strategyPipeline.compiled.rules,
      strategy: strategyPipeline.compiled,
    });
    const zones = buildInstitutionalZones({ analysis });
    const m15Entry = evaluateEntry({
      zone: zones.selectedZone,
      side: zones.selectedSide,
      snapshots,
    });
    const monitoringState = createMonitoringState({
      pair,
      timeframes: effectiveTimeframes,
      zones: [zones.buyZone, zones.sellZone].filter(Boolean),
    });
    const monitoring = runMonitoringLoop({
      pair,
      zones: [zones.buyZone, zones.sellZone].filter(Boolean),
      latestSnapshot: snapshots[snapshots.length - 1] || null,
      previousState: monitoringState,
      entrySignal: m15Entry,
    });
    const executionOrder = monitoring.rebuildRequested || !m15Entry.passed ? null : deriveExecutionOrder(pair, zones.selectedZone, zones.selectedSide);
    const validation = executionOrder ? validateExecutionOrder(executionOrder) : { valid: false, issues: ['zone-missing-or-entry-incomplete'], status: 'blocked' };
    const transportOrder = validation.valid ? submitExecutionOrder(executionOrder) : null;

    return {
      pair,
      timeframes: effectiveTimeframes,
      acquisition: pairPackage,
      snapshots,
      analysis,
      zones,
      entry: m15Entry,
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
    pairs: effectivePairs,
    timeframes: effectiveTimeframes,
    candleLimit,
    acquisition,
    strategyPipeline,
    pairRuns,
    backtest,
    statistics,
    generatedAt: new Date().toISOString(),
  };
}

module.exports = {
  deriveExecutionOrder,
  startOrchestrator,
};
