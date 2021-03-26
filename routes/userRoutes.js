const customSignup = require('../middleware/customSignup');
const customAuth = require('../middleware/customPassportAuthenticate');
const express = require('express');
const router = express.Router();

// Using the passport.authenticate middleware with our local strategy.
router.post('/login', customAuth, function(req, res) {
  res.json({ status: true, id: req.user._id, type: req.user.type, message: "You're now logged in!" });
});

// Route for signing up a user.
router.post('/signup', customSignup, customAuth, function(req, res) {
  res.json({ status: true, id: req.user._id, type: req.user.type, message: "You're now logged in!" });
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
