const { parseStrategy } = require('./parser');
const { compileStrategy } = require('./compiler');

function runStrategyPipeline(rawStrategy) {
  const parsed = parseStrategy(rawStrategy);
  const compiled = compileStrategy(parsed);

  return {
    parsed,
    compiled,
    status: 'ready',
  };
}

module.exports = {
  runStrategyPipeline,
};
