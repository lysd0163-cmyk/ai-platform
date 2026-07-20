function runAmir({ layers = [] } = {}) {
  return {
    layers,
    status: 'placeholder',
    passed: false,
    intersection: null,
  };
}

module.exports = {
  runAmir,
};
