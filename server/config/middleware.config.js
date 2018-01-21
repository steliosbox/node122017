// .env
require('dotenv').config();
// -----------------------------------------------------------------------------
const path = require('path');
const express = require('express');
const morgan = require('morgan');
const favicon = require('serve-favicon');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
// -----------------------------------------------------------------------------
// Initializing connection to DB
const mongoose = require('./mongoose.config');
// Initializing express
const app = express();
// -----------------------------------------------------------------------------
// Variables 
const publicDir = 'public_html';
const faviconDir = `${publicDir}/images`;
const faviconName = 'favicon.ico';
// Set 'expires' for cookie's maxAge
// milliseconds * seconds * minutes * hours * days = 7 days
const expires = 1000 * 60 * 60 * 24 * 7;
// Options for 'express-session' & saving session in DB
const sessionOptions = {
  secret: process.env.SECRET_KEY,
  key: 'sid',
  store: new MongoStore({ mongooseConnection: mongoose.connection }),
  resave: false,
  saveUninitialized: true,
  cookie: {
    // secure: true,
    maxAge: expires
  }
};
// -----------------------------------------------------------------------------
app
  .disable('x-powered-by')
  // 'morgan' middleware
  .use(morgan('dev'))
  // 'serve-favicon' middleware
  .use(favicon(path.join(process.cwd(), faviconDir, faviconName)))
  // static files handler
  .use(express.static(path.join(process.cwd(), publicDir)))
  // 'body-parser' middleware
  .use(bodyParser.json({ type: 'text/plain' }))
  .use(bodyParser.urlencoded({ extended: false }))
  // 'cookie-parser' middleware
  .use(cookieParser())
  // 'express-session' middleware
  .use(session(sessionOptions))
  // 'passport' middleware
  .use(passport.initialize({ userProperty: 'payload' }))
  .use(passport.session());

module.exports = app;