var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
const User = require('../app/models/user.model.js');


passport.use(new LocalStrategy({
    usernameField: 'email'
  },
  function(email, password, done) {
    User.findOne({ email: email }, function (err, user) {
      if (err) { return done(err); }
      // Return if user not found in database
      if (!user) {
        return done(null, false, {
          message: 'User not found'
        });
      }
	if (user){
	      // Return if password is wrong
	      if (!user.validPassword(password)) {
		return done(null, false, {
		  message: 'Password is wrong'
		});
	      }
	      // If credentials are correct, return the user object
	      else return done(null, user);
	}
    });
  }
));
