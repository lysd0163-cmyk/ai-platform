function healthCheck() {
  return {
    ok: true,
    service: 'ai-platform-api',
    checkedAt: new Date().toISOString(),
  };
}

module.exports = {
  healthCheck,
};
