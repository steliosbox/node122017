const requireIp = require('request-ip');

module.exports = (req, res, next) => {
  req.ip = requireIp.getClientIp(req);
  // console logging user's ip addresss
  console.log('Request was made by user with ip:', req.ip);
  next();
};