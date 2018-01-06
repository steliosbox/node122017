const path = require('path');

const Koa = require('koa');
const Pug = require('koa-pug');

const favicon = require('koa-favicon');
const serve = require('koa-static');
const session = require('koa-session');
const morgan = require('koa-morgan');

const app = new Koa();
const pug = new Pug({
  viewPath: path.join(process.cwd(), 'server/views/pages'),
  basedir: path.join(process.cwd(), 'server/public_html')
});

pug.use(app); // add koa-pug

app.keys = ['some secret key']; // set the session keys
app
  .use(favicon())
  .use(serve(path.join(process.cwd(), 'public_html')))
  .use(session(app)) // add koa-session
  .use(morgan('dev'))
  .use(require('./routers/index').routes());

const server = app.listen(process.env.PORT || 3000, () => {
  console.log('Server running on port %d', server.address().port);
});
