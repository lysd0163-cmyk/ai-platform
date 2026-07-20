function createAcquisitionCache({ ttlMs = 15000 } = {}) {
  const store = new Map();

  function makeKey(pair, timeframe, kind = 'candles') {
    return `${pair || 'UNKNOWN'}::${timeframe || 'NA'}::${kind}`;
  }

  function get(pair, timeframe, kind = 'candles') {
    const key = makeKey(pair, timeframe, kind);
    const entry = store.get(key);
    if (!entry) {
      return null;
    }

    if (Date.now() - entry.savedAt > ttlMs) {
      store.delete(key);
      return null;
    }

    return entry.value;
  }

  function set(pair, timeframe, kind, value) {
    const key = makeKey(pair, timeframe, kind);
    store.set(key, { value, savedAt: Date.now() });
    return value;
  }

  function clear() {
    store.clear();
  }

  function snapshot() {
    return Array.from(store.entries()).map(([key, entry]) => ({ key, savedAt: entry.savedAt }));
  }

  return {
    get,
    set,
    clear,
    snapshot,
  };
}

module.exports = {
  createAcquisitionCache,
};
