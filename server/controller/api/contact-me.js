const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
const Emails = require('../../models/emails');
const config = require('../../../config');

module.exports = (req, res, next) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.json({ mes: "Заполните все поля!", status: "Error" });
  }

  const transporter = nodemailer.createTransport(config.nodemailer);
  const mailOptions = {
    from: `${name} <${email}>`,
    to: config.email,
    subject: config.subject,
    text: `Message from: ${name} <${email}>\n ${message}`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) return res.json({ mes: error, status: "Error" });

    const emails = new Emails({
      _id: new mongoose.Types.ObjectId(),
      name: name,
      from: email,
      subject: config.subject,
      text: message
    });

    emails.save()
      .then(result => res.json({ mes: "Сообщение отправлено!", status: "OK" }))
      .catch(error => res.json({ mes: error, status: "Error" }));
  });
};
