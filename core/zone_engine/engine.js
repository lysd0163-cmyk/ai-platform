const { buildZones } = require('./zones');
const { filterZones } = require('./filter');

function buildInstitutionalZones({ analysis } = {}) {
  const zones = buildZones({ analysis });
  const filtered = {
    buyZone: zones.buyZone && zones.buyZone.valid !== false ? zones.buyZone : null,
    sellZone: zones.sellZone && zones.sellZone.valid !== false ? zones.sellZone : null,
  };

  const selectedZone = zones.selectedZone && zones.selectedZone.valid !== false ? zones.selectedZone : null;
  const availableZones = filterZones([filtered.buyZone, filtered.sellZone]);

  return {
    analysis,
    buyZone: filtered.buyZone,
    sellZone: filtered.sellZone,
    selectedSide: zones.selectedSide,
    selectedZone,
    availableZones,
    status: selectedZone ? 'ready' : 'empty',
  };
}

module.exports = {
  buildInstitutionalZones,
};
