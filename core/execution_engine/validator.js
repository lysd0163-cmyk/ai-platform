function validateExecutionOrder(order = {}) {
  return {
    order,
    valid: Boolean(order && order.symbol && order.side),
    status: 'placeholder',
  };
}

module.exports = {
  validateExecutionOrder,
};
