const passport = require('../middleware/passport');

module.exports = function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) {
      next(err);
    } else if (!user) {
      res.status(401).json({ status: false, message: info.message });
    } else {
      req.logIn(user, function(err) {
        if (err) {
          next(err);
        } else {
          next();
        }
      });
    }
  })(req, res, next);
};
