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

function startDashboard({ port = process.env.PORT || 3000, runtime = null, runtimeRef = null } = {}) {
  const server = http.createServer((req, res) => {
    const currentRuntime = readRuntime(runtimeRef || runtime);
    const summary = currentRuntime
      ? {
          status: currentRuntime.status || 'running',
          pairs: Array.isArray(currentRuntime.pairRuns) ? currentRuntime.pairRuns.length : 0,
          trades: currentRuntime.backtest?.trades?.length || 0,
          winRate: currentRuntime.statistics?.winRate ?? 0,
          acquisitionPairs: currentRuntime.acquisition?.packageByPair?.length || 0,
          acquisitionLimit: currentRuntime.candleLimit || currentRuntime.acquisition?.limit || null,
        }
      : null;

    if (req.url === '/status') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ app: 'AI Platform', runtime: summary }));
      return;
    }

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      app: 'AI Platform',
      status: 'running',
      path: req.url,
      runtime: summary,
    }));
  });

  server.listen(port, () => {
    console.log(`AI Platform running on port ${port}`);
  });

  return server;
}

module.exports = {
  startDashboard,
};
