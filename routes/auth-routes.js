const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');

const User = require('../models/user');

const router = express.Router();
const bcryptSalt = 10;


router.get('/signup', (req, res, next) => {
  res.render('auth/signup', {
    errorMessage: ''
  });
});

router.post('/signup', (req, res, next) => {
  const usernameInput = req.body.username;
  const emailInput = req.body.email;
  const passwordInput = req.body.password;

  if ( usernameInput === '' || emailInput === '' || passwordInput === '') {
    res.render('auth/signup', {
      errorMessage: 'Please fill out all fields to sign up.'
    });
    return;
  }

  User.findOne({ email: emailInput }, '_id', (err, existingUser) => {
    if (err) {
      next(err);
      return;
    }

    if (existingUser !== null) {
      res.render('auth/signup', {
        errorMessage: `The email ${emailInput} is already in use.`
      });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashedPass = bcrypt.hashSync(passwordInput, salt);

    const userSubmission = {
      username: usernameInput,
      email: emailInput,
      password: hashedPass
    };

    const theUser = new User(userSubmission);

    theUser.save((err) => {
      if (err) {
        res.render('auth/signup', {
          errorMessage: 'Something went wrong. Try again later.'
        });
        return;
      }

      res.redirect('/');
    });
  });
});

// router.post('/signup', (req, res, next) => {
// });

router.get('/login', (req, res, next) => {
  res.render('auth/login.ejs', {
    errorMessage: req.flash('error')
  });
});

router.post('/login',
  passport.authenticate('local', {
    successReturnToOrRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true,
    successFlash: 'You have been logged in, user!'
  })
);

router.get("/logout", (req, res) => {
  req.logout();
  req.flash('success', 'You have logged out.');
  res.redirect("/");
});


module.exports = router;
