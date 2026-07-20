function filterZones(zones = []) {
  return zones.filter((zone) => zone && zone.isValid !== false);
}

module.exports = {
  filterZones,
};
