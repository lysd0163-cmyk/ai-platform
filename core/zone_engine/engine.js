function buildInstitutionalZones({ analysis } = {}) {
  return {
    analysis,
    buyZone: null,
    sellZone: null,
    status: 'placeholder',
  };
}

module.exports = {
  buildInstitutionalZones,
};
