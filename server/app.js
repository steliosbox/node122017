// -----------------------------------------------------------------------------
// importing file with middleware config
const app = require('./config/middleware.config');
// -----------------------------------------------------------------------------
// setting port for connection
app.set('port', process.env.PORT || 8080);
// -----------------------------------------------------------------------------
// redirecting all API requests to './router/api.routes.js'
app.use('/api', require('./router/api.routes.js'));
// redirecting all NOT API requests to './router/html.routes.js'
app.use('*', require('./router/html.routes.js'));
// -----------------------------------------------------------------------------
// middleware for all errors
app.use(require('./api/error.js'));
// -----------------------------------------------------------------------------
// start listening for connections
app.listen(app.get('port'), () => {
  let hostname = `http://localhost:${app.get('port')}/`;

  if (process.env.IP) {
    hostname = `http://${process.env.IP}:${app.get('port')}/`;
  }

  console.log('Server running on', hostname);
});
