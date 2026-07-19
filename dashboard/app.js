const http = require('http');

const port = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    app: 'AI Platform',
    status: 'starting',
    path: req.url,
  }));
});

server.listen(port, () => {
  console.log(`AI Platform running on port ${port}`);
});
