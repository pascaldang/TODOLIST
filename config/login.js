var LocalStrategy   = require('passport-local').Strategy;
var User            = require('../app/models/user');
var bcrypt = require('bcryptjs');
var salt = bcrypt.genSaltSync(10);

module.exports = function(passport) {
  passport.serializeUser(function(user, done) {
    done(null, user._id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

  passport.use('login', new LocalStrategy({
    passReqToCallback : true
  },
  function(req, username, password, done) { 
    // check in mongo if a user with username exists or not
    User.findOne({ 'username' :  username }, 
      function(err, user) {
        // In case of any error, return using the done method
        if (err)
          return done(err);
        // Username does not exist, log error & redirect back
        if (!user){
          console.log('User Not Found with username '+username);
          return done(null, false, 
            req.flash('message', 'Utilisateur inconnu!'));                 
        }
        if (bcrypt.compare(password, user.password, function(err, res) {
              res = true;
            })
        ) {
          console.log('Wrong password');
          return done(null, false, 
            req.flash('message', 'Mauvais mot de passe!')); 
        }
        // User and password both match, return user from 
        // done method which will be treated like success
        return done(null, user);
      }
    );
  }));
};