// -----------------------------------------------------------------------------
// importing file with middleware config
const app = require('./config/middleware.config');
// -----------------------------------------------------------------------------
// connecting to socket
const http = require('http');
const server = http.createServer(app);
const io = require('socket.io')(server);
// handling socket connections
require('./socket/index.js')(io);
// -----------------------------------------------------------------------------
// redirecting all API requests to './router/api.routes.js'
app.use('/api', require('./router/api.routes.js'));
// redirecting all NOT API requests to './router/html.routes.js'
app.use('*', require('./router/html.routes.js'));
// -----------------------------------------------------------------------------
// middleware for all errors
app.use(require('./api/error.js'));
// -----------------------------------------------------------------------------
// setting server port
app.set('port', (process.env.PORT || 8080));
// setting server hostname
app.set('host', (process.env.IP || 'localhost'));
// start listening for connections
server.listen(app.get('port'), app.get('host'), () => {
  console.log(`Server running on http://${app.get('host')}:${app.get('port')}`);
});
