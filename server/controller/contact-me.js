module.exports = (req, res, next) => {
  res.status(200).render('contact-me', { 'auth': req.session.auth });
};
