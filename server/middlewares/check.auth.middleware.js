const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  // getting secret from user's ip 
  const secret = req.userIp;
  // getting token from cookie
  const token = req.cookies.access_token;
  // callback of jwt.verigy method
  const callback = (err, decoded) => {
    // If an error occurred, set status 406
    // Status 406 - Not Acceptable («неприемлемо»)
    if (err) {
      err.status = 406;
    }
    // send error if occurred
    // otherwise NULL
    next(err || null);
  };
  // varify token
  jwt.verify(token, secret, callback);
};
