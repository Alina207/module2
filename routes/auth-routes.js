const express    = require("express");
const authRoutes = express.Router();

// User model
const User       = require("../models/user.js");

// Bcrypt to encrypt passwords
const bcrypt     = require("bcrypt");

authRoutes.get("/signup", (req, res, next) => {
  res.render("auth/signup.ejs");
});

authRoutes.post("/signup", (req, res, next) => {
  const email = req.body.email; // added email
  const username = req.body.username;
  const password = req.body.password;

  if (email === "" || username === "" || password === "") { // added email
    res.render("auth/signup.ejs", { message: "Indicate email, username, and password" });
    return;
  }

  User.findOne({ email }, "email", (err, user) => { // added email
    if (user !== null) {
      res.render("auth/signup.ejs", { message: "There is already an account associated with that email" });
      return;
    }

  User.findOne({ username }, "username", (err, user) => {
    if (user !== null) {
      res.render("auth/signup.ejs", { message: "The username already exists" });
      return;
    }

    const salt     = bcrypt.genSaltSync(10);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = User({
      email: email, // email added
      // firstName: req.body.firstName, // removed
      // lastName: req.body.lastName, // removed
      username: username,
      encryptedPassword: hashPass
    });

    newUser.save((err) => {
      if (err) {
        res.render("auth/signup.ejs", { message: "Something went wrong" });
      } else {
        req.flash('success', 'You have been registered. Try logging in.');
        res.redirect("/");
      }
    });
  });
});
});


const passport = require('passport');

authRoutes.get('/login', (req, res, next) => {
  res.render('auth/login.ejs', {
    errorMessage: req.flash('error')
  });
});

authRoutes.post('/login',
  passport.authenticate('local', {
    successReturnToOrRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true,
    successFlash: 'You have been logged in, user!',
    passReqToCallback: true
  })
);

authRoutes.get("/logout", (req, res) => {
  req.logout();
  req.flash('success', 'You have logged out.');
  res.redirect("/");
});


authRoutes.get('/auth/goodreads', passport.authenticate('goodreads'));
authRoutes.get('/auth/goodreads/callback', passport.authenticate('goodreads',  {
  successRedirect: "/",
  failureRedirect: "/login"
}));



module.exports = authRoutes;
