var express = require("express");
var router = express.Router();
const bcrypt = require("bcryptjs");
const convert = require("xml-js");
router.use(express.urlencoded({ extended: true }));

let UserDB = require("../models/user.js");
let GameShelfDB = require("../models/gameshelf.js");

const saltRounds = 10;

new UserDB.User(
  "dakota@test.com",
  bcrypt.hashSync("123", saltRounds),
  "Dakota",
  "Kallas"
);
new GameShelfDB.GameShelf("dakota@test.com", []);

new UserDB.User(
  "other@test.com",
  bcrypt.hashSync("123", saltRounds),
  "Other",
  "User"
);
new GameShelfDB.GameShelf("other@test.com", []);

// Routes

router.all("*", (req, res, next) => {
  if (req.session && req.session.user) {
    next();
  } else if (req.session) {
    req.session.regenerate((err) => {
      res.redirect("/");
    });
  } else {
    res.redirect("/");
  }
});

/**
 * GET GAMESHELF FOR USER
 */
router.get("/gameshelf", function (req, res, next) {
  try {
    let gameshelf = GameShelfDB.getByOwner(req.session.user.email);
    res.status(200).send(gameshelf);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

/**
 * GET DISCOVER
 */
router.get("/discover", function (req, res, next) {
  try {
    let searchName = req.query.name;
    console.log("! Approached: " + searchName);
    if (searchName) {
      fetch(`https://api.geekdo.com/xmlapi/search?search=uno%20moo`)
        .then((response) => response.text())
        .then((data) => {
          const json = convert.xml2json(data, { compact: true, spaces: 4 });
          console.log("JSON: " + json);
          res.status(200).json(JSON.parse(json));
        })
        .catch((err) => {
          console.error("Error: " + err.message);
          res.status(400).send("Error occurred!");
        });
    } else {
      res.status(400).send("Issue!");
    }
  } catch (err) {
    res.status(400).send(err.message);
  }
});

module.exports = router;
