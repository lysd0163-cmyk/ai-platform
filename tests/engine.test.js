const assert = require('assert');
const { getTimeframes } = require('../core/market_data/timeframes');

assert.deepStrictEqual(getTimeframes(), ['D1', 'H4', 'H1', 'M15']);
console.log('engine.test.js passed');
