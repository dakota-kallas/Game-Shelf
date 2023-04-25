var express = require("express");
var router = express.Router();
const bcrypt = require("bcryptjs");
let UserDB = require("../models/user.js");
let GameShelfDB = require("../models/gameshelf.js");

const multer = require("multer");
const upload = multer();

router.post("/login", upload.none(), async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  let user = await UserDB.getByEmail(email);
  const ERROR = `Invalid credentials`;

  if (user) {
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
            .send("This account has been disabled, contact an admin for more.");
        }
      } else {
        res.status(401).send(ERROR);
      }
    });
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
    if (result) {
      res.status(200).send(result);
    } else {
      res.status(403).send("Session user invalid.");
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
    let user = await UserDB.createUser(
      email,
      bcrypt.hashSync(password, 10),
      firstName,
      lastName,
      true,
      false
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
