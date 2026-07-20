const TIMEFRAME_MAP = {
  D1: '1day',
  H4: '4h',
  H1: '1h',
  M15: '15min',
};

function normalizePairSymbol(pair = '') {
  const text = String(pair || '').trim().toUpperCase();
  if (!text) {
    return '';
  }

  if (text.includes('/')) {
    return text;
  }

  if (text.length === 6) {
    return `${text.slice(0, 3)}/${text.slice(3)}`;
  }

  return text;
}

function mapTimeframeToInterval(timeframe = '') {
  return TIMEFRAME_MAP[String(timeframe || '').toUpperCase()] || String(timeframe || '').toLowerCase();
}

function parseTwelveDataCandles(values = [], pair = '', timeframe = '') {
  return [...values]
    .map((value) => ({
      pair,
      timeframe,
      time: value.datetime || value.timestamp || null,
      open: Number(value.open),
      high: Number(value.high),
      low: Number(value.low),
      close: Number(value.close),
      volume: Number(value.volume ?? 0),
    }))
    .filter((candle) => [candle.open, candle.high, candle.low, candle.close].every(Number.isFinite))
    .sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());
}

function createTwelveDataProvider({ apiKey = process.env.TWELVE_DATA_API_KEY, baseUrl = 'https://api.twelvedata.com' } = {}) {
  async function fetchCandles({ pair, timeframe, source = {}, limit = 500 } = {}) {
    if (!apiKey) {
      return Array.isArray(source.candles) ? source.candles : [];
    }

    const symbol = normalizePairSymbol(pair);
    const interval = mapTimeframeToInterval(timeframe);
    const url = new URL('/time_series', baseUrl);
    url.searchParams.set('symbol', symbol);
    url.searchParams.set('interval', interval);
    url.searchParams.set('outputsize', String(Math.max(1, Number(limit) || 500)));
    url.searchParams.set('format', 'JSON');
    url.searchParams.set('apikey', apiKey);

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Twelve Data request failed with status ${response.status}`);
    }

    const payload = await response.json();
    if (!payload || payload.status === 'error') {
      const message = payload?.message || 'Unknown Twelve Data error';
      throw new Error(message);
    }

    const candles = parseTwelveDataCandles(payload.values || [], pair, timeframe);
    return candles.slice(-Math.max(1, Number(limit) || 500));
  }

  async function fetchCharts() {
    return [];
  }

  return {
    providerName: 'twelvedata',
    fetchCandles,
    fetchCharts,
    normalizePairSymbol,
    mapTimeframeToInterval,
  };
}

module.exports = {
  TIMEFRAME_MAP,
  normalizePairSymbol,
  mapTimeframeToInterval,
  parseTwelveDataCandles,
  createTwelveDataProvider,
};
