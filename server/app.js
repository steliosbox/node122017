// -----------------------------------------------------------------------------
// importing file with middleware config
const app = require('./config/middleware.config');
// -----------------------------------------------------------------------------
// redirecting all API requests to './router/api.routes.js'
app.use('/api', require('./router/api.routes.js'));
app.use('/chat', (req, res, next) => {
  console.log('chat');
  next();
});
// redirecting all NOT API requests to './router/html.routes.js'
app.use('*', require('./router/html.routes.js'));
// -----------------------------------------------------------------------------
// middleware for all errors
app.use(require('./api/error.js'));
// -----------------------------------------------------------------------------
const http = require('http');
const server = http.createServer(app);
const io = require('socket.io')(server);

// -----------------------------------------------------------------------------
// start listening for connections
server.listen(8080, () => {
  let hostname = `http://localhost:8080/`;
  console.log('Server running on', hostname);
});

const uuid = require('uuid/v1');
const clients = {};

io.on('connection', socket => {
  // creating unique id
  const id = uuid();
  // setting id to socket
  socket.id = id;
  // setting username to the socket
  socket.username = socket.handshake.headers.username;
  // setting socket in object
  clients[id] = socket;
  // empty array for all new users
  const newUsers = [];
  // extracting username & id
  for (const user in clients) {
    clients[user].emit('new user', { username: socket.id, id: socket.username });
    // push all object into array
    newUsers.push({
      username: clients[user].username,
      id: clients[user].id
    });
  }

  socket.broadcast.emit('new user', { username: socket.id, id: socket.username });
  // sending users array to the client
  socket.emit('all users', newUsers);
  // on 'chat message' event
  socket.on('chat message', (message, to) => {
    clients[to].emit('chat message', message, socket.id);
  });
  // on 'disconnect' event
  socket.on('disconnect', (data) => {
    delete clients[socket.id];
  });
});
