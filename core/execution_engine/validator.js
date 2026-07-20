function validateExecutionOrder(order = {}) {
  const issues = [];
  if (!order || typeof order !== 'object') {
    issues.push('order-missing');
  }
  if (!order.symbol) {
    issues.push('symbol-missing');
  }
  if (!order.side || !['buy', 'sell'].includes(String(order.side).toLowerCase())) {
    issues.push('side-invalid');
  }
  if (!Number.isFinite(Number(order.entry))) {
    issues.push('entry-invalid');
  }

  return {
    order,
    issues,
    valid: issues.length === 0,
    status: issues.length === 0 ? 'ready' : 'blocked',
  };
}

module.exports = {
  validateExecutionOrder,
};
