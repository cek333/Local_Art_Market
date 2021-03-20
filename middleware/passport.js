const UsersDAO = require('../dao/UsersDAO');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

// Use a Local Strategy. In other words, we want login with a username/email and password
passport.use(new LocalStrategy(
  // Our user will sign in using an email, rather than a "username"
  {
    usernameField: 'email',
    passReqToCallback: true,
  },
  async function(req, email, password, done) {
    // When a user tries to sign in this code runs
    const dbUser = await UsersDAO.getUserByEmail(email, req.body.type);
    // If there's no user with the given email
    if (!dbUser) {
      done(null, false, { message: 'Email not found!' });
    } else {
      // Note: dbUser.password is the hashed password
      if (bcrypt.compareSync(password, dbUser.password)) {
        done(null, dbUser);
      } else {
        // password check failed
        done(null, false, { message: 'Incorrect password!' });
      }
    }
  }
));

// Sequelize/Deserialize logic
passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(async function(id, done) {
  // Get user from database
  const dbUser = await UsersDAO.getUserById(id);
  done(null, dbUser);
});

// Exporting our configured passport
module.exports = passport;
