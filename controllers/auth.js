const express = require('express');
const router = express.Router();
const db = require('../models');
const passport = require('../config/passportConfig')

router.get('/signup', function(req, res) {
  res.render('auth/signup');
});
router.post('/signup', function(req, res) {
  db.user.findOrCreate({
    where: { email: req.body.email },
    defaults: {
      name: req.body.name,
      password: req.body.password
    }
  }).spread(function(user, created) {
    if (created) {
      console.log('User created!')
      passport.authenticate('local', {
        successRedirect: '/'
      })(req, res);
    } else {
      console.log('Email already exists!');
      res.redirect('/auth/signup');
    }
  }).catch(function(error) {
    console.log('An error occured: ' + error.message);
    res.redirect('/auth/signup');
  });
});

router.get('/login', function(req, res) {
  res.render('auth/login');
});
router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/auth/login'
})); 

router.get('/logout', function(req, res) {
  req.logout();
  console.log('logged out');
  res.redirect('/');
});

module.exports = router;
