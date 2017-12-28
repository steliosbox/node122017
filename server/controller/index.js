module.exports = (req, res, next) => {
  res.status(200).render('index', { 'auth': req.session.auth });
};
