const assert = require('assert');
const { calculateStatistics } = require('../core/reporting_engine/statistics');

const stats = calculateStatistics({ trades: [{}, {}] });
assert.strictEqual(stats.trades, 2);
console.log('integration.test.js passed');
