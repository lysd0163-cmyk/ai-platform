const http = require('http');

function startApi(port = 4000) {
  const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ service: 'ai-platform-api', path: req.url }));
  });

  server.listen(port);
  return server;
}

module.exports = {
  startApi,
};
