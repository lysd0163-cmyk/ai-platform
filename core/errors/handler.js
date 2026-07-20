function normalizeError(error) {
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      stack: error.stack || null,
    };
  }

  return {
    name: 'Error',
    message: String(error),
    stack: null,
  };
}

function createErrorHandler(logger = console) {
  return (error, context = {}) => {
    const payload = {
      ...normalizeError(error),
      context,
      timestamp: new Date().toISOString(),
    };

    if (typeof logger.error === 'function') {
      logger.error(payload.message, payload);
    }

    return payload;
  };
}

module.exports = {
  createErrorHandler,
  normalizeError,
};
