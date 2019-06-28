require('dotenv').config();
const express = require('express');
const ejsLayouts = require('express-ejs-layouts');
//Module allows use of sessions
const session = require('express-session');
//import passport local strategy
const passport = require('./config/passportConfig');
//modules for flash messages
const flash = require('connect-flash');
const isLoggedIn = require('./middleware/isLoggedIn');
const app = express();

app.set('view engine', 'ejs');

app.use(require('morgan')('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + "/public"));
app.use(ejsLayouts);

//Configures the express-session middleware
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}));

// Starts the flash middleware
app.use(flash());

// Link passport to express-session
// must be below session
app.use(passport.initialize());
app.use(passport.session());

app.use(function(req, res, next) {
  // before every route, attach the flash messages and current user to res.locals
  res.locals.alerts = req.flash();
  res.locals.currentUser = req.user;
  next();
});

app.get('/', function(req, res) {
  res.render('index');
});

app.get('/profile', isLoggedIn, function(req, res) {
  res.render('profile');
});

app.use('/auth', require('./controllers/auth'));  // require part contains export of a router

var server = app.listen(process.env.PORT || 3000);

module.exports = server;







