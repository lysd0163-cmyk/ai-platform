function createDataProvider({ candleFetcher = null, chartFetcher = null } = {}) {
  async function fetchCandles({ pair, timeframe, source = {} } = {}) {
    if (typeof candleFetcher === 'function') {
      return candleFetcher({ pair, timeframe, source });
    }

    return Array.isArray(source.candles) ? source.candles : [];
  }

  async function fetchCharts({ pair, timeframe, source = {} } = {}) {
    if (typeof chartFetcher === 'function') {
      return chartFetcher({ pair, timeframe, source });
    }

    const chartAssets = source.chartAssets || source.chartImages || (source.chartImage ? [source.chartImage] : []);
    return Array.isArray(chartAssets) ? chartAssets : [chartAssets].filter(Boolean);
  }

  return {
    fetchCandles,
    fetchCharts,
  };
}

module.exports = {
  createDataProvider,
};
