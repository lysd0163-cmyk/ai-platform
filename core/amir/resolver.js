function resolveAmir({ intersection } = {}) {
  return {
    intersection,
    status: 'placeholder',
    resolved: Boolean(intersection && intersection.valid),
  };
}

module.exports = {
  resolveAmir,
};
