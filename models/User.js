const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt-nodejs");

// define our model
const userSchema = new Schema({
  email: { type: String, unique: true, lowercase: true }, // Makes sure the email is unique (cannot have 2 of the
  // same emails).
  password: String
});

// On save hook, encrypt password
// Before saving a model run this function
// before the model gets saves (pre), run this function
userSchema.pre("save", function(next) {
  // Get access to the user model
  const user = this; // user is an instance of the user model

  //generate a salt, and run callback after it has been created
  bcrypt.genSalt(10, function(err, salt) {
    if (err) {
      return next(err);
    }

    // hash (encrypt) our password using the salt. this takes some more amount of time, at which point another
    // callback is called, the result of which is the hash (or the encrypted password)
    bcrypt.hash(user.password, salt, null, function(err, hash) {
      //hash (encypted password) is returned
      if (err) {
        return next(err);
      }

      // overwrite plain text pass with encrypted pass
      user.password = hash;

      // next saves the model
      next();
    });
  });
});

// Whenever we make a new user object, its going to have access to any functions we make on the 'methods' property
userSchema.methods.comparePassword = function(candidatePassword, callback) {
  // cancidatePassword is the password someone ispassing in
  // this.password is our 'hashed and salted' password
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) {
      return callback(err);
    }
    callback(null, isMatch);
  });
};

// create the model class
const ModelClass = mongoose.model("user", userSchema);

// export the model
module.exports = ModelClass;
