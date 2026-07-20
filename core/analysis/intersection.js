function intersectLayers(layers = []) {
  const normalizedLayers = layers.map((layer) => ({
    name: layer?.name || 'unknown',
    value: Boolean(layer?.value),
    reason: layer?.reason || '',
    meta: layer?.meta || {},
  }));

  const passingLayers = normalizedLayers.filter((layer) => layer.value);
  const failingLayers = normalizedLayers.filter((layer) => !layer.value);

  return {
    passingLayers,
    failingLayers,
    passedCount: passingLayers.length,
    totalCount: normalizedLayers.length,
    valid: normalizedLayers.length > 0 && failingLayers.length === 0,
    reasons: failingLayers.map((layer) => `${layer.name}: ${layer.reason || 'failed'}`),
  };
}

module.exports = {
  intersectLayers,
};
