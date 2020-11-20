var express = require("express");
var router = express.Router();
var passport = require("passport");
var util = require("util");
var session = require("express-session");
var DynamoDBStore = require("connect-dynamodb")(session);
var GoogleStrategy = require("passport-google-oauth2").Strategy;
var AWS = require("aws-sdk");

var GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
var GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

AWS.config.update({
  accessKeyId: process.env.ACCESS_KEY,
  secretAccessKey: process.env.ACCESS_KEY_SECRET,
  region: "us-west-1",
  // bottom endpoint used for local
  // endpoint: "http://localhost:8000",
});
var dynamodb = new AWS.DynamoDB();

// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.  However, since this example does not
//   have a database of user records, the complete Google profile is
//   serialized and deserialized.
/*
passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (obj, done) {
  done(null, obj);
});
*/
// Use the GoogleStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and Google
//   profile), and invoke a callback with a user object.
passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      //NOTE :
      //Carefull ! and avoid usage of Private IP, otherwise you will get the device_id device_name issue for Private IP during authentication
      //The workaround is to set up thru the google cloud console a fully qualified domain name such as http://mydomain:3000/
      //then edit your /etc/hosts local file to point on your private IP.
      //Also both sign-in button + callbackURL has to be share the same url, otherwise two cookies will be created and lead to lost your session
      //if you use it.
      callbackURL: "http://localhost:3000/auth/google/callback",
      passReqToCallback: true,
    },
    function (request, accessToken, refreshToken, profile, done) {
      // asynchronous verification, for effect...
      process.nextTick(function () {
        // To keep the example simple, the user's Google profile is returned to
        // represent the logged-in user.  In a typical application, you would want
        // to associate the Google account with a user record in your database,
        // and return that user instead.
        return done(null, profile);
      });
    }
  )
);
//initialzie session
/*
router.use(
  session({
    store: new DynamoDBStore(options),
    secret: "new user",
    resave: true,
    saveUninitialized: true,
  })
);
*/
//router.use(passport.initialize());
//router.use(passport.session());
/*
router.use((req, res, next) => {
  if (!req.session.views) {
    req.session.views = 0;
  }
  console.log(req.session.views);
  next();
});
*/
/* GET users listing. */
router.get("/", function (req, res, next) {
  const numberOfViews = ++req.session.views;
  console.log("from user branch" + numberOfViews);

  //console.log(req.user);
  //req.session.test = "test";
  res.send("respond with a resource");
  res.send(`The /private page has been visited ${numberOfViews} times.`);

  res.send({ user: req.user });
});

/*
router.get("/private", (req, res) => {
  const numberOfViews = ++req.session.views;
  res.send(`The /private page has been visited ${numberOfViews} times.`);
});
*/
router.get("/", function (req, res) {
  res.send("index", { user: req.user });
});

router.get("/account", ensureAuthenticated, function (req, res) {
  res.send({ user: req.user });
});

router.get("/login", function (req, res) {
  res.send({ user: req.user });
});

// GET /auth/google
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Google authentication will involve
//   redirecting the user to google.com.  After authorization, Google
//   will redirect the user back to this application at /auth/google/callback
router.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["email", "profile", "openid"],
  })
);

// GET /auth/google/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: "/",
    failureRedirect: "/login",
  })
);

router.get("/logout", function (req, res) {
  req.logout();
  res.redirect("/");
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

module.exports = router;
