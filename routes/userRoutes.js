const customSignup = require('../middleware/customSignup');
const customAuth = require('../middleware/customPassportAuthenticate');
const express = require('express');
const router = express.Router();

// const UsersDAO = require('../dao/UsersDAO');
// router.post('/test_id', async function(req, res) {
//   const result = await UsersDAO.getUserById(req.body.id);
//   console.log('user_by_id', result);
//   res.json({ status: true, message: "Test by Id Success!" });
// });

// router.post('/test_email', async function(req, res) {
//   const email = req.body.email;
//   const type = req.body.type;
//   const result = await UsersDAO.getUserByEmail(email, type);
//   console.log('user_by_email', result);
//   res.json({ status: true, message: "Test by Email Success!" });
// });

function constructUserForClient(user) {
  // console.log('constructUserForClient', user);
  if (user) {
    return {
      id: user.typeId,
      type: user.type,
      name: user.name,
      location: user.location
    };
  } else {
    return { id: '', type: 'customer', name: '', location: null };
  }
}

// Using the passport.authenticate middleware with our local strategy.
router.post('/login', customAuth, function(req, res) {
  res.json({ status: true, ...constructUserForClient(req.user), message: "You're now logged in!" });
});

// Route for signing up a user.
router.post('/signup', customSignup, customAuth, function(req, res) {
  res.json({ status: true, ...constructUserForClient(req.user), message: "You're now logged in!" });
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
  res.json({ status: true, ...constructUserForClient(req.user) });
});

module.exports = router;
