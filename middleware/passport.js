const UsersDAO = require('../dao/UsersDAO');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

// Use a Local Strategy. In other words, we want login with a username/email and password
passport.use(new LocalStrategy(
  // Our user will sign in using an email, rather than a "username"
  {
    usernameField: 'email',
    passReqToCallback: true
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
        const reqUser = constructUserForPassport(dbUser);
        done(null, reqUser);
      } else {
        // password check failed
        done(null, false, { message: 'Incorrect password!' });
      }
    }
  }
));

function constructUserForPassport(user) {
  const reqUser = { _id: user._id, type: user.type, typeId: user.typeId };
  if (user.type === 'artist') {
    reqUser.name = user.artistInfo[0].name;
    reqUser.location = user.artistInfo[0].address.location;
  } else {
    reqUser.name = user.customerInfo[0].name;
    reqUser.location = user.customerInfo[0].address.location;
  }
  return reqUser;
}

// Sequelize/Deserialize logic
passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(async function(id, done) {
  // Get user from database
  const dbUser = await UsersDAO.getUserById(id);
  const reqUser = constructUserForPassport(dbUser);
  done(null, reqUser);
});

// Exporting our configured passport
module.exports = passport;
