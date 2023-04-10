var express = require("express");
var router = express.Router();
const bcrypt = require("bcryptjs");
let UserDB = require("../models/user.js");

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
        req.session.regenerate(() => {
          delete user.password;
          req.session.user = user;
          res.json(user);
        });
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
      res.status(403).send("An error occured, try again later.");
    }
  } catch (err) {
    res.status(400).send(err.message);
  }
});

module.exports = router;
