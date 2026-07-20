function createExecutionClient({ venue = 'MetaTrader' } = {}) {
  return {
    venue,
    submit: async (order) => ({
      order,
      venue,
      status: 'placeholder',
      submittedAt: new Date().toISOString(),
    }),
  };
}

module.exports = {
  createExecutionClient,
};
