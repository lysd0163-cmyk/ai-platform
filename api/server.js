const http = require('http');

function startApi({ port = 4000, runtime = null } = {}) {
  const server = http.createServer((req, res) => {
    const summary = runtime
      ? {
          status: runtime.status || 'running',
          pairs: Array.isArray(runtime.pairRuns) ? runtime.pairRuns.length : 0,
          strategy: runtime.strategyPipeline?.compiled?.strategyName || null,
          backtestTrades: runtime.backtest?.trades?.length || 0,
        }
      : null;

    if (req.url === '/health') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: true, service: 'ai-platform-api' }));
      return;
    }

    if (req.url === '/status') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ service: 'ai-platform-api', runtime: summary }));
      return;
    }

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ service: 'ai-platform-api', path: req.url, runtime: summary }));
  });

  server.listen(port);
  return server;
}

module.exports = {
  startApi,
};
