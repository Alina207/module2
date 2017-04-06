const express    = require("express");
const authRoutes = express.Router();



// User model
const User       = require("../models/user-model.js");

// Bcrypt to encrypt passwords
const bcrypt     = require("bcrypt");

authRoutes.get("/signup", (req, res, next) => {
  res.render("auth/signup-view.ejs");
});

authRoutes.post("/signup", (req, res, next) => {
  const email = req.body.email; // added email
  const username = req.body.username;
  const password = req.body.password;

  if (email === "" || username === "" || password === "") {
    res.render("auth/signup-view.ejs", { message: "Indicate email, username, and password" });
    return;
  }

  User.findOne({ email }, "email", (err, user) => { // added email
    if (user !== null) {
      res.render("auth/signup-view.ejs", { message: "There is already an account associated with that email" });
      return;
    }

    const salt     = bcrypt.genSaltSync(10);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = User({
      email: email,
      username: username,
      encryptedPassword: hashPass
    });

    newUser.save((err) => {
      if (err) {
        res.render("auth/signup-view.ejs", { message: "Something went wrong" });
      } else {
        req.flash('success', 'You have been registered. Try logging in.');
        res.redirect("/");
      }
    });
  });
});


const passport = require('passport');

authRoutes.get('/login', (req, res, next) => {
  res.render('auth/login-view.ejs', {
    errorMessage: req.flash('error')
  });
});


// authRoutes.post('/',
//   passport.authenticate('local'), (req, res) => {
//     res.redirect(`/user/${req.user.id}`);
//   });

  authRoutes.post('/login',
    passport.authenticate('local', {
      successReturnToOrRedirect: '/books', // used to be /user
      failureRedirect: '/',
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


authRoutes.get("/auth/google", passport.authenticate("google", {
  scope: ["https://www.googleapis.com/auth/plus.login",
          "https://www.googleapis.com/auth/plus.profile.emails.read"]
}));
authRoutes.get("/auth/google/callback", passport.authenticate("google", {
  successRedirect: "/",
  failureRedirect: "/",
}));


module.exports = authRoutes;
