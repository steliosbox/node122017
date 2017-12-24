const http = require('http');
const Events = require('events');
const eventEmmiter = new Events();
const server = http.createServer();

const PORT = process.env.PORT || 3000;
const interval = process.argv[2] * 1000;
const timer = process.argv[3] * 1000;

let unsetInterval;

if (!process.argv[2] || !process.argv[3]) {
  process.stdout.write('Please specify interval as first & clear interval as second argument\n');
  process.exit(1);
}

eventEmmiter.on('connected', (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/plain' });

  const time = () => {
    const utc = new Date().toUTCString();
    response.write(utc);
    console.log(utc);
  };

  time();
  unsetInterval = setInterval(() => {
    time();
  }, interval);

  setTimeout(() => {
    clearInterval(unsetInterval);
    response.end();
  }, timer);

  request.on('close', () => {
    clearInterval(unsetInterval);
    response.end();
  });
});

server.on('request', (request, response) => {
  if (request.url === '/') {
    console.log('We got new request.');
    eventEmmiter.emit('connected', request, response);
  }
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
