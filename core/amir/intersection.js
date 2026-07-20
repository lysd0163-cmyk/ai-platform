function evaluateAmirIntersection({ layers = [] } = {}) {
  const passed = layers.filter(Boolean).length;
  return {
    layers,
    passed,
    total: layers.length,
    valid: layers.length > 0 && passed === layers.length,
  };
}

module.exports = {
  evaluateAmirIntersection,
};
