const { createTwelveDataProvider } = require('./twelvedata');

function createDataProvider({ candleFetcher = null, chartFetcher = null, apiKey = process.env.TWELVE_DATA_API_KEY, baseUrl = 'https://api.twelvedata.com' } = {}) {
  if (typeof candleFetcher === 'function' || typeof chartFetcher === 'function') {
    return {
      fetchCandles: async ({ pair, timeframe, source = {} } = {}) => {
        if (typeof candleFetcher === 'function') {
          return candleFetcher({ pair, timeframe, source });
        }
        return Array.isArray(source.candles) ? source.candles : [];
      },
      fetchCharts: async ({ pair, timeframe, source = {} } = {}) => {
        if (typeof chartFetcher === 'function') {
          return chartFetcher({ pair, timeframe, source });
        }
        const chartAssets = source.chartAssets || source.chartImages || (source.chartImage ? [source.chartImage] : []);
        return Array.isArray(chartAssets) ? chartAssets : [chartAssets].filter(Boolean);
      },
    };
  }

  return createTwelveDataProvider({ apiKey, baseUrl });
}

module.exports = {
  createDataProvider,
};
