module.exports = (req, res, next) => {
  if (!req.secure) res.redirect(`https://${req.hostname}`);
  else next();
};