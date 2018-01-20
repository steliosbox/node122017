module.exports = (req, res, next) => {
  req.ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  // console logging user's ip address
  console.log('Request was made by user with ip:', req.ip);
  next();
};
