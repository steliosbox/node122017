const http = require('http');
const server = http.createServer();
const PORT = process.env.PORT || 3000;

server.on('request', (request, response) => {
  response.end('Hello world!');
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
