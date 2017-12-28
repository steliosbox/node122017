module.exports = (req, res, next) => {
  res.status(200).render('login', { 'auth': req.session.auth });
};
