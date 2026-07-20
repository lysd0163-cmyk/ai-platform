async function withRetry(task, { retries = 2, delayMs = 200, factor = 2 } = {}) {
  let attempt = 0;
  let waitMs = Math.max(0, Number(delayMs) || 0);
  let lastError = null;

  while (attempt <= retries) {
    try {
      return await task(attempt);
    } catch (error) {
      lastError = error;
      if (attempt >= retries) {
        throw error;
      }
      await new Promise((resolve) => setTimeout(resolve, waitMs));
      waitMs = Math.max(0, waitMs * (Number(factor) || 2));
      attempt += 1;
    }
  }

  throw lastError;
}

module.exports = {
  withRetry,
};
