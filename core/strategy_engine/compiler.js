function compileStrategy(parsedStrategy = {}) {
  const sections = parsedStrategy.sections || [];
  const directives = parsedStrategy.directives || [];
  const rules = parsedStrategy.rules || [];

  return {
    strategyName: parsedStrategy.strategyName || 'Unnamed Strategy',
    version: parsedStrategy.version || 'unknown',
    sections,
    directives,
    rules: rules.map((rule, index) => ({
      id: rule.id || `rule-${index + 1}`,
      text: rule.text || '',
      tags: rule.tags || [],
      enabled: rule.enabled !== false,
      weight: Number.isFinite(rule.weight) ? rule.weight : 1,
    })),
    status: 'compiled',
  };
}

module.exports = {
  compileStrategy,
};
