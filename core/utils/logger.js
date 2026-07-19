function log(message, meta = {}) {
  return {
    level: 'info',
    message,
    meta,
    timestamp: new Date().toISOString(),
  };
}

module.exports = {
  log,
};
