const formidable = require('formidable');
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
const Emails = require('../../models/emails');

module.exports = (req, res, next) => {
  const form = new formidable.IncomingForm();

  form.parse(req, (err, fields, files) => {
    if (err) return next(err);

    nodemailer.createTestAccount((err, account) => {
      const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: 'homer.test01@gmail.com',
          pass: 'homertest'
        }
      });

      const mailOptions = {
        from: `${fields.name} <${fields.email}>`,
        to: 'homer.test01@gmail.com',
        subject: 'Message from Homer "contact me" form',
        text: `Message from: ${fields.name} <${fields.email}>\n ${fields.message}`,
        // html: '<b>Hello world?</b>' // html body
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) return res.json({ mes: error, status: "Error" });

        const emails = new Emails({
          _id: new mongoose.Types.ObjectId(),
          timestamp: Date.now(),
          name: fields.name,
          from: fields.email,
          subject: 'Message from Homer "contact me" form',
          text: fields.message
        });

        emails.save()
          .then(result => res.json({ mes: "Сообщение отправлено!", status: "OK" }))
          .catch(error => next(error));
      });
    });
  });
};
