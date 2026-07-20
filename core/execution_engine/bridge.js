function submitExecutionOrder(order = {}) {
  return {
    ...order,
    status: 'placeholder',
    submittedAt: new Date().toISOString(),
  };
}

module.exports = {
  submitExecutionOrder,
};
