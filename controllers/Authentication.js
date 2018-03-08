const jwt = require("jwt-simple");
const User = require("../models/User");
const config = require("../Config");

function tokenForUser(user) {
  const timestamp = new Date().getTime();
  // 'sub' = subject (as in the subject of the jwt is the id of user). 'iat' = "issued at time"
  return jwt.encode({ sub: user.id, iat: timestamp }, config.secret);
}

exports.signIn = function(req, res, next) {
  // user has already had email and password authed, we just need to give them a token
  res.send({ token: tokenForUser(req.user) });
};

exports.signUp = function(req, res, next) {
  const email = req.body.email;
  const password = req.body.password;

  // See if a user with the given email exists
  // err variable automatically populared with an error if the function finds an existing user (existingUser
  // variable is populated)
  if (!email || !password) {
    return res
      .status(422)
      .send({ error: "Must provide a valid email and a password" });
  }

  User.findOne({ email: email }, function(err, existingUser) {
    // If database or anything else throws an error
    if (err) {
      return next(err);
    }
    // If a user with email DOES exist, return an error
    if (existingUser) {
      return res.status(422).send({ error: "Email is in use" }); // 422 means "unprocessible entity"
    }

    // If a user with email DOES NOT exist, create and save user record
    const user = new User({
      // creates a new user with this information
      email: email,
      password: password
    });

    user.save(function(err) {
      if (err) {
        return next(err);
      }

      // Respond to request indicating the user was created
      res.json({ token: tokenForUser(user) });
    });
  });
};
