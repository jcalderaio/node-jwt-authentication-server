const passport = require("passport");
const User = require("../models/User");
const config = require("../Config");
const ExtractJwt = require("passport-jwt").ExtractJwt;
// There are passport "strategys" for handling facebook, twitter, github - and you can read about
// it on the Passport official docs
// JwtStrategy verifies the token
const JwtStrategy = require("passport-jwt").Strategy; // A "stategy" for authenticating a user
// JwtStrategy verifies the email and password
const LocalStrategy = require("passport-local");

//Create local strategy
// it expects a 'username' and a 'password' field. Username is username, so thats handle automatically,
// but we have to tell it to pick the 'email' field off of the header
const localLogin = new LocalStrategy({ usernameField: "email" }, function(
  email,
  password,
  done
) {
  //verify this username and password, call done with the user if it is the correct user/pass
  // otherwise call done with false
  User.findOne({ email: email }, function(err, user) {
    // find a existing user in database with email
    if (err) {
      return done(err);
    }
    if (!user) {
      return done(null, false);
    }

    // compare password supplied by request with user's saved password - is 'password' == user.password?
    user.comparePassword(password, function(err, isMatch) {
      if (err) {
        return done(err);
      }
      if (!isMatch) {
        return done(null, false);
      }
      return done(null, user);
    });
  });
});

// setup options for jwt strategy
const jwtOptions = {
  // WHenever a request comes in that we want passport to handle, it needs to look at the request header,
  // specifically, the authorization header
  jwtFromRequest: ExtractJwt.fromHeader("authorization"),
  // the secrtet to use to decode the token
  secretOrKey: config.secret
};

// create jwt strategy
// this function will be called whenever we need to authenticate a user with a jwtToken
const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done) {
  // see if the user id if the payload exists in our database, if so call done with the user.
  // Else, call done without the user object
  //Payload is the decoded jwtToken
  User.findById(payload.sub, function(err, user) {
    // Was an error, and did not return the user
    if (err) {
      return done(err, false);
    }

    if (user) {
      done(null, user); // Found user. No error
    } else {
      done(null, false); // Did not find user, and still no error.
    }
  });

  // done is a callback we call depending if we successfully authenticate this user
});

// tell passport to use this strategy
passport.use(jwtLogin);
passport.use(localLogin);
