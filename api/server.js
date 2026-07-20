const http = require('http');

function readRuntime(runtimeOrRef = null) {
  if (!runtimeOrRef) {
    return null;
  }

  if (typeof runtimeOrRef === 'function') {
    return runtimeOrRef();
  }

  if (typeof runtimeOrRef === 'object' && runtimeOrRef.current) {
    return runtimeOrRef.current;
  }

  return runtimeOrRef;
}

function startApi({ port = 4000, runtime = null, runtimeRef = null } = {}) {
  const server = http.createServer((req, res) => {
    const currentRuntime = readRuntime(runtimeRef || runtime);
    const summary = currentRuntime
      ? {
          status: currentRuntime.status || 'running',
          pairs: Array.isArray(currentRuntime.pairRuns) ? currentRuntime.pairRuns.length : 0,
          strategy: currentRuntime.strategyPipeline?.compiled?.strategyName || null,
          backtestTrades: currentRuntime.backtest?.trades?.length || 0,
          acquisitionPairs: currentRuntime.acquisition?.packageByPair?.length || 0,
          acquisitionLimit: currentRuntime.candleLimit || currentRuntime.acquisition?.limit || null,
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
