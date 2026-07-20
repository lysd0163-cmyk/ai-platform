function scoreAnalysis({ layers = [] } = {}) {
  const validLayers = layers.filter(Boolean).length;
  return {
    validLayers,
    totalLayers: layers.length,
    score: layers.length === 0 ? 0 : validLayers / layers.length,
    status: 'placeholder',
  };
}

module.exports = {
  scoreAnalysis,
};
