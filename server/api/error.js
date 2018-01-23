module.exports = (err, req, res, next) => {
  const url = req.url.indexOf('/api');
  const status = err.status || 500;
  const message = err.message || 'Server error!';
  const type = (url !== -1) ? 'json' : 'send';

  res.status(status)[type](message);

  // example for error
  // next({ status: 404, message: 'some text' });
  // or
  // const err = new Error(text for error);
  // err.status = status for error;
  // next(err);
};
