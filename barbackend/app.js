var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var passport = require("passport");
var bodyParser = require("body-parser");
var passport = require("passport");
var session = require("express-session");
var DynamoDBStore = require("connect-dynamodb")(session);

var GoogleStrategy = require("passport-google-oauth2").Strategy;
var AWS = require("aws-sdk");
var cors = require("cors");
require("dotenv").config({ path: __dirname + "/.env" });
var GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
var GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
var app = express();
var options = {
  table: "app-sessions",
  AWSConfigJSON: {
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.ACCESS_KEY_SECRET,
    region: "us-west-1",
  },
  client: dynamodb,
};
//initialzie session

app.use(
  session({
    store: new DynamoDBStore(options),
    secret: "new user",
    resave: true,
    saveUninitialized: true,
  })
);

AWS.config.update({
  accessKeyId: process.env.ACCESS_KEY,
  secretAccessKey: process.env.ACCESS_KEY_SECRET,
  region: "us-west-1",
});
var dynamodb = new AWS.DynamoDB();

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
        return done(null, profile);
        /*
        var params = {
          TableName: "app-sessions",

          Key: {
            "id": {
              S: profile.id,
            },
          },
        };
        dynamodb.getItem(params, function (err, user) {
          if (err) return done(err);

          if (user) {
            console.log("here");
            // if a user is found, log them in
            return done(null, user);
          } else {
            // if the user isnt in our database, create a new user
            var newUser = new User();

            // set all of the relevant information
            newUser.google.id = profile.id;
            newUser.google.token = token;
            newUser.google.name = profile.displayName;
            newUser.google.email = profile.emails[0].value; // pull the first email

            var paramsTwo = {
              TableName: "app-sessions",
              "sess": {
                "user.id": { S: profile.id },
                "user.token": { S: token },
                "user.name": { S: profile.displayName },
                "user.email": { S: profile.emails[0].value },
              },
            };
            // save the user
            dynamodb.putItem(paramsTwo, function (err) {
              console.log("in put");
              if (err) throw err;
              return done(null, paramsTwo.sess);
            });
          }
        });
        */
      });
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (obj, done) {
  done(null, obj);
});

var server = require("http").createServer(app);

var userDrinksRouter = require("./routes/userDrinks");
var drinksRouter = require("./routes/drinks");
var ingredientsRouter = require("./routes/ingredients");
var liquorRouter = require("./routes/liquors");
var justIngredients = require("./routes/justIngredients");

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3001");
  res.header("Access-Control-Allow-Credentials", true);
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(logger("dev"));

app.use(passport.initialize());
app.use(passport.session());
//   serialized and deserialized.

app.use((req, res, next) => {
  console.log(req.user);
  next();
});
app.get("/", function (req, res) {
  res.status(200).send({ user: req.user });
});

app.get("/account", ensureAuthenticated, function (req, res) {
  res.status(200).send({ user: req.user });
});

app.get("/login", function (req, res) {
  res.status(200).send({ user: req.user });
});
app.get("/users", function (req, res) {
  res.send({ user: req.user });
});

// GET /auth/google
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Google authentication will involve
//   redirecting the user to google.com.  After authorization, Google
//   will redirect the user back to this application at /auth/google/callback
app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email", "openid"],
  })
);

// GET /auth/google/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
  }),
  function (req, res) {
    res.redirect("http://localhost:3001/");
  }
);

app.get("/logout", function (req, res) {
  req.logout();
  res.redirect("http://localhost:3001/");
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

//app.use(ensureAuthenticated);
app.use("/drinks", drinksRouter);
app.use("/userDrinks", userDrinksRouter);
app.use("/ingredients", ingredientsRouter);
app.use("/liquors", liquorRouter);
app.use("/justIngredients", justIngredients);

/*


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});
*/

server.listen(3000, () => console.log("Drinks API listening on port 3000!"));
