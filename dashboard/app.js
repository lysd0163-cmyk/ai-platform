const http = require('http');

function startDashboard({ port = process.env.PORT || 3000, runtime = null } = {}) {
  const server = http.createServer((req, res) => {
    const summary = runtime
      ? {
          status: runtime.status || 'running',
          pairs: Array.isArray(runtime.pairRuns) ? runtime.pairRuns.length : 0,
          trades: runtime.backtest?.trades?.length || 0,
          winRate: runtime.statistics?.winRate ?? 0,
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
