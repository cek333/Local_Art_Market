const UsersDAO = require('../dao/UsersDAO');
const ArtistsDAO = require('../dao/ArtistsDAO');
const CustomersDAO = require('../dao/CustomersDAO');
const customAuth = require('../middleware/customPassportAuthenticate');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

// Using the passport.authenticate middleware with our local strategy.
router.post('/login', customAuth, function(req, res) {
  res.json({ status: true, id: req.user._id, type: req.user.type, message: "You're now logged in!" });
});

// Route for signing up a user.
router.post('/signup', async function(req, res, next) {
  const hashedPswd = bcrypt.hashSync(req.body.password, 10);
  const email = req.body.email;
  const type = req.body.type;
  let result;
  try {
    const checkUser = await UsersDAO.getUserByEmail(email, type);
    if (checkUser) {
      return res.status(400).json({ status: false, message: 'Email already exists! Login instead.' });
    }
    if (type === 'artist') {
      result = await ArtistsDAO.createProfile();
    } else {
      result = await CustomersDAO.createProfile();
    }
    const newId = result.insertedId;
    result = await UsersDAO.addUser(email, hashedPswd, type, newId);
    // newUser = await UsersDAO.getUserById(newId);
    const newUser = result.ops[0];
    console.log('signup, new user:', newUser);
    req.logIn(newUser, function(err) {
      if (err) {
        next(err);
      } else {
        res.json({ status: true, id: newUser._id, type: newUser.type, message: "You're now logged in!" });
      }
    });
  } catch (e) {
    console.error(`Error occurred while adding new user, ${e}`);
    res.status(400).json({ status: false, message: 'Unknown error on signup.' });
  }
});

// Route for logging user out
router.post('/logout', function(req, res) {
  req.logout();
  req.session.save(function(err) {
    if (err) {
      console.error(`Error occurred while logging out user, ${err}`);
      res.json({ status: false, message: 'Error logging out. Please try again.' });
    } else {
      res.json({ status: true, message: "You've been logged out!" });
    }
  });
});

// Get current logged in user
router.get('/fetch', function(req, res) {
  if (req.user) {
    res.json({ status: true, id: req.user._id, type: req.user.type });
  } else {
    res.json({ status: false, id: '', type: '' });
  }
});

module.exports = router;
