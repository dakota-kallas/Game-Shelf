var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var session = require("express-session");
var passport = require("passport");
const compression = require("compression");
let mongoose = require("mongoose");
var indexRouter = require("./routes/index");
var authRouter = require("./routes/auth");

var app = express();
app.use(compression());
require("dotenv").config({ path: ".env" });

mongoose.connect(process.env.MONGODB_CONNECT_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false,
      maxAge: 10 * 60 * 1000,
    },
  })
);
// Initialize Passport
app.use(passport.initialize());

// Enable session support
app.use(passport.session());

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/robots.txt", function (req, res, next) {
  res.type("text/plain");
  res.send("User-agent: *\nAllow: /");
});

app.use("/api/v1", authRouter);
app.use("/api/v1", indexRouter);
app.all("*", (req, res, next) => {
  res.redirect("/");
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
