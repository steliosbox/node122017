const path = require('path');
const router = require('koa-router')();
const CSRF = require('koa-csrf');
const koaBody = require('koa-body');

// подключаем базу - "lowdb"
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('db.json');
const db = low(adapter);

router
  .use(koaBody())
  .use(new CSRF())
  .get('/', async (ctx, next) => {
    ctx.render('login', { csrfToken: ctx.csrf });
  })
  .post('/', async (ctx, next) => {
    const { login, password } = ctx.request.body;
    const user = db
      .get('users')
      .find({ login: login })
      .value();

    if (!login || !password) {
      ctx.body = { mes: 'Заполните все поля!', status: 'Error' };
    } else if (!user || user.password !== password) {
      ctx.body = { mes: 'Логин и/или пароль введены неверно!', status: 'Error' };
    } else if (user && user.password === password) {
      ctx.body = { mes: 'Aвторизация успешна!', status: 'OK' };
    }
  });

module.exports = router;
