var express = require("express");
var router = express.Router();
const bcrypt = require("bcryptjs");
let UserDB = require("../models/user.js");
let GameShelfDB = require("../models/gameshelf.js");

const multer = require("multer");
const upload = multer();

var passport = require("passport");
var GoogleStrategy = require("passport-google-oidc");
require("dotenv").config({ path: "./.env" });

router.get("/login/federated/google", passport.authenticate("google"));

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/v1/oauth2/redirect/google",
      scope: ["profile", "email"],
    },
    async function verify(issuer, profile, done) {
      const email = profile.emails[0].value;
      const firstName = profile.name.givenName;
      const lastName = profile.name.familyName;

      let user = await UserDB.getByEmail(email);

      if (!user) {
        try {
          let newUser = await UserDB.createUser(
            email,
            null,
            firstName,
            lastName,
            true,
            false,
            "Google"
          )
            .then((user) => {
              GameShelfDB.createGameShelf(user.email, [])
                .then((gameshelf) => {
                  return done(null, user);
                })
                .catch((error) => {
                  throw new Error(
                    "Error creating GameShelf document:" + error.message
                  );
                });
            })
            .catch((error) => {
              throw new Error("Error creating User document:" + error.message);
            });
        } catch (err) {
          return done(null, false, {
            message: "User not found",
          });
        }
      } else {
        if (user && user.password) {
          delete user.password;
        }

        if (user && !user.enabled) {
          return done(null, false, {
            message: "User is disabled.",
          });
        } else {
          console.log(`$ Google Login User: ${JSON.stringify(user)}`);
          return done(null, user);
        }
      }
    }
  )
);

passport.serializeUser(function (user, done) {
  console.log(`$ serializeUser: ${JSON.stringify(user)}`);
  done(null, user);
});

passport.deserializeUser(async function (user, done) {
  console.log(`$ deserializeUser: ${JSON.stringify(user)}`);
  done(null, user);
});

router.get(
  "/oauth2/redirect/google",
  passport.authenticate("google", {
    successRedirect: "/",
    failureRedirect: "/",
  })
);

router.post("/login", upload.none(), async (req, res) => {
  const email = req.body.email.toLowerCase();
  const password = req.body.password;

  let user = await UserDB.getByEmail(email);
  const ERROR = `Invalid credentials`;

  if (user) {
    if (user.password) {
      bcrypt.compare(password, user.password, function (err, result) {
        if (err) {
          res.status(401).send(ERROR);
        } else if (result) {
          if (user.enabled) {
            req.session.regenerate(() => {
              delete user.password;
              req.session.user = user;
              res.json(user);
            });
          } else {
            res
              .status(403)
              .send(
                "This account has been disabled, contact an admin for more."
              );
          }
        } else {
          res.status(401).send(ERROR);
        }
      });
    } else {
      res.status(401).send(ERROR);
    }
  } else {
    res.status(401).send(ERROR);
  }
});

router.post("/logout", upload.none(), (req, res) => {
  req.session.destroy(() => {
    res.status(200).send();
  });
});

router.get("/who/", (req, res) => {
  try {
    let result = req.session && req.session.user ? req.session.user : undefined;
    console.log(`$ req.session: ${JSON.stringify(req.session)}`);
    console.log(
      `$ req.session.passport: ${JSON.stringify(req.session.passport)}`
    );
    if (result) {
      res.status(200).send(result);
    } else {
      console.log(`$ NO RESULT`);
      if (req.session.passport && req.session.passport.user) {
        console.log(`$ SETTING SESSION USER`);
        let user = req.session.passport.user;
        req.session.regenerate(() => {
          req.session.user = user;
          res.status(200).send(user);
        });
      } else {
        console.log(`$ NO PASSPORT AND USER`);
        res.status(403).send("Session user invalid.");
      }
    }
  } catch (err) {
    res.status(400).send(err.message);
  }
});

/**
 * USER REGISTRATION
 */
router.post("/users", async (req, res) => {
  const email = req.body.email.toLowerCase();
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const password = req.body.password;

  try {
    if (!validateEmail(email) || !validatePassword(password)) {
      throw new Error("Invalid credentials provided for registration.");
    }

    let existingUser = await UserDB.getByEmail(email);

    if (existingUser) {
      throw new Error("An account already exists with that email.");
    }

    let user = await UserDB.createUser(
      email,
      bcrypt.hashSync(password, 10),
      firstName,
      lastName,
      true,
      false,
      "local"
    )
      .then((user) => {
        GameShelfDB.createGameShelf(user.email, [])
          .then((gameshelf) => {
            res.status(200).send(user);
          })
          .catch((error) => {
            throw new Error(
              "Error creating GameShelf document:" + error.message
            );
          });
      })
      .catch((error) => {
        throw new Error("Error creating User document:" + error.message);
      });
  } catch (err) {
    res.status(409).send(err.message);
  }
});

function validatePassword(password) {
  if (password.length < 8) {
    return false;
  }

  if (/\s/.test(password)) {
    return false;
  }

  return true;
}

function validateEmail(email) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return emailPattern.test(email);
}

module.exports = router;
