function intersectLayers(layers = []) {
  const passed = layers.filter((layer) => layer === true);
  return {
    passedCount: passed.length,
    totalCount: layers.length,
    passed,
    valid: layers.length > 0 && passed.length === layers.length,
  };
}

module.exports = {
  intersectLayers,
};
