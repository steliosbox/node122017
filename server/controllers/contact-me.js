const path = require('path');
const router = require('koa-router')();
const koaBody = require('koa-body');

const nodemailer = require('nodemailer');
// подключаем базу - "lowdb"
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('db.json');
const db = low(adapter);

router
  // обрабатываем "GET" запрос
  // ///////////////////////////////////////////////////////////////
  .get('/', async (ctx, next) => {
    ctx.render('contact-me');
  })
  // обрабатываем "POST" запрос
  // ///////////////////////////////////////////////////////////////
  .post('/', koaBody(), async (ctx, next) => {
    const { name, email, message } = ctx.request.body;

    if (!name || !email || !message) {
      ctx.body = { mes: 'Заполните все поля', status: 'Error' };
    } else {
      // настройки для отправки сообщение
      const transporter = nodemailer.createTransport({
        'host': 'smtp.gmail.com',
        'port': 465,
        'secure': true,
        'auth': {
          'user': 'homer.test01@gmail.com',
          'pass': 'homertest'
        }
      });
      // опции для отправки сообщение
      const mailOptions = {
        from: `${name} <${email}>`,
        to: 'homer.test01@gmail.com',
        subject: 'Message from Homer "contact me" form',
        text: `Message from: ${name} <${email}>\n ${message}`
      };
      // отправляем сообщение
      await transporter.sendMail(mailOptions, (error, info) => {
        if (error) ctx.body = { mes: error.message, status: 'Error' };
        return false;
      });
      // сохраняем проект в базу - "lowdb"
      await db.get('emails')
        .push({
          'timestamp': Date.now(),
          'name': name,
          'email': email,
          'message': message
        })
        .write();
      // сообщаем пользователю о успешной отправке сообщения
      ctx.body = { mes: 'Сообщение отправлено!', status: 'OK' };
    }
  });

module.exports = router;
