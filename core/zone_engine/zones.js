function buildZones({ analysis = null } = {}) {
  const candidates = analysis?.candidates || {};
  const buyZone = candidates.buyZone ? { ...candidates.buyZone, type: 'buy' } : null;
  const sellZone = candidates.sellZone ? { ...candidates.sellZone, type: 'sell' } : null;
  const selectedSide = analysis?.zones?.selectedSide || null;
  const selectedZone = selectedSide === 'buy' ? buyZone : selectedSide === 'sell' ? sellZone : null;

  return {
    buyZone,
    sellZone,
    selectedSide,
    selectedZone,
    status: selectedZone ? 'ready' : 'empty',
  };
}

module.exports = {
  buildZones,
};
