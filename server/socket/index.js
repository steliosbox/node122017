// storage for all users
const clients = {};

module.exports = io => {
  // on connection to the socket
  io.on('connection', socket => {
    // preparing user's object
    const user = {
      id: socket.id, // users id
      username: socket.handshake.headers.username // user username
    };
    // saving user
    clients[socket.id] = user;
    // sending all users object to the connected client
    socket.emit('all users', clients);
    // sending new user's object to all clients (except the current)
    io.sockets.emit('new user', user);
    // handling the incoming messages
    socket.on('chat message', (msg, user) => {
      // on new message, send it to the recipient
      socket.broadcast.to(user).emit('chat message', msg, socket.id);
    });
    // handling disconnects
    socket.on('disconnect', () => {
      // sending to all clients the object of disconnected user
      io.sockets.emit('delete user', socket.id);
      // deleting the user from object
      delete clients[socket.id];
    });
  });
};
