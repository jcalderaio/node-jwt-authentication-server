const Authentication = require("./controllers/Authentication");
const passportService = require("./services/Passport");
const passport = require("passport");

// Use the jwt strategy, and when a user is authenticated, dont make a cookie session for them
const requireAuth = passport.authenticate("jwt", { session: false });
const requireSignin = passport.authenticate("local", { session: false });

// POST, since user will be passing in username and password
module.exports = function(app) {
  // If we want to add any protected route in the future, all we have to do is define the route handler as the first
  // argument, requireAuth as 2ns, and whatever the protected route is as the 3rd arguement
  app.get("/", requireAuth, function(req, res) {
    res.send({ hi: "there" });
  });
  app.post("/signin", requireSignin, Authentication.signIn);
  app.post("/signup", Authentication.signUp);
};
