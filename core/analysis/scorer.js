function scoreAnalysis({ layers = [], intersection = null } = {}) {
  const validLayers = layers.filter((layer) => layer && layer.value === true).length;
  const totalLayers = layers.length;
  const completeness = totalLayers === 0 ? 0 : validLayers / totalLayers;
  const intersectionBonus = intersection?.valid ? 0.15 : 0;
  const score = Math.min(1, completeness * 0.85 + intersectionBonus);

  return {
    validLayers,
    totalLayers,
    completeness: Number(completeness.toFixed(4)),
    score: Number(score.toFixed(4)),
    passed: intersection?.valid === true && validLayers === totalLayers && totalLayers > 0,
    status: intersection?.valid ? 'strong' : 'weak',
  };
}

module.exports = {
  scoreAnalysis,
};
