const express = require('express');
const router = express.Router();
const db = require('../model');

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
      res.redirect('/');
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

module.exports = router;
