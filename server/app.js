// -----------------------------------------------------------------------------
// importing file with middleware config
const app = require('./config/middleware.config');
// importing custom middlewares
const requestIp = require('./middlewares/request-ip-middleware.js');
// -----------------------------------------------------------------------------
// redirecting all API requests to './router/api.routes.js'
app.use('/api', requestIp, require('./router/api.routes.js'));
// redirecting all NOT API requests to './router/html.routes.js'
app.use('*', requestIp, require('./router/html.routes.js'));
// -----------------------------------------------------------------------------
// middleware for all errors
app.use((err, req, res, next) => {
  const url = req.url.indexOf('/api');
  const status = err.status || 500;
  const message = err.message || 'Server error!';
  const type = (url !== -1) ? 'json' : 'send';

  res.status(status)[type](message);

  // example for error
  // next({ status: 404, message: 'some text' });
  // or
  // const err = new Error(text for error);
  // err.status = status for error;
  // next(err);
});
// -----------------------------------------------------------------------------
// setting port for connection
app.set('port', process.env.PORT || 8080);
// start listening for connections
app.listen(app.get('port'), () => {
  console.log('Server running on port', app.get('port'));
});
