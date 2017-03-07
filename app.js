const express      = require('express');
const path         = require('path');
const favicon      = require('serve-favicon');
const logger       = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser   = require('body-parser');
const expressLayouts = require('express-ejs-layouts');
const mongoose     = require('mongoose');
const session      = require('express-session');
const passport     = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt        = require('bcrypt');
const flash         = require('connect-flash');
const dotenv        = require('dotenv');

const User          = require('./models/user.js');

dotenv.config();
mongoose.connect(process.env.MONGODB_URI);


const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// default value for title local
app.locals.title = 'SoundShelf';

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(expressLayouts);

app.use(session({
  secret: 'SoundShelf Sessions Passport App',
  resave: true,
  saveUninitialized: true
}));
//
// app.use((req, res, next) => {
//   if (req.user){
//     res.local.user = req.user;
//   } else {
//     res.local.user = null;
//   }
//   next();
// });

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

    // <input type="email" name="email" id="email-input">
    //                             |
    //                     ---------
    //                     |
    // { usernameField: 'email' },
passport.use(new LocalStrategy( // different from passport ex
  { usernameField: 'email'},
  (email, password, next) => {
    User.findOne({ email: email }, (err, user) => {
      if (err) {
        next(err);
      } else if (!user) {
        next(null, false, { message: "Incorrect email" });
      } else if (!bcrypt.compareSync(password, user.password)) {
        next(null, false, { message: "Incorrect password" });
      } else {
        next(null, user);
      }
    });
  }
));

// passport.use(new GoodreadsStrategy({
//     consumerKey: process.env.GOODREADS_KEY,
//     consumerSecret: process.env.GOODREADS_SECRET,
//     callbackURL: process.env.HOST_ADDRESS + '/auth/goodreads/callback'
//   }, //different from fbStrateg and GoogleStrategy
//   function(token, tokenSecret, profile, done) {
//     User.findOrCreate({ goodreadsId: profile.id }, function (err, user) {
//       return done(err, user);
//     });
//   }
// ));

passport.serializeUser((user, cb) => {
  if (user.provider) {
    cb(null, user);
  } else {
    cb(null, user._id);
  }
});

passport.deserializeUser((id, cb) => {
  if (id.provider) {
    cb(null, id);
    return;
  }

  User.findOne({ "_id": id }, (err, user) => {
    if (err) { return cb(err); }
    cb(null, user);
  });
});

// ---------------_ROUTES GO HERE ---------------
const index = require('./routes/index');
app.use('/', index);

const users = require('./routes/users'); // need?
app.use('/user', users);

const authRoutes = require('./routes/auth-routes.js');
app.use('/', authRoutes);

const books = require('./routes/books.js');
app.use('/', books);

// --------------------------------------------

// need?  app.set('layout', 'layout');

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
