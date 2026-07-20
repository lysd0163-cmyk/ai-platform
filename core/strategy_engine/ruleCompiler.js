function compileStrategyRules(rawRules = []) {
  return rawRules.map((rule, index) => ({
    id: `rule-${index + 1}`,
    ...rule,
    compiled: true,
  }));
}

module.exports = {
  compileStrategyRules,
};
