var express = require("express");
var router = express.Router();
const bcrypt = require("bcryptjs");
const convert = require("xml-js");
router.use(express.urlencoded({ extended: true }));

let UserDB = require("../models/user.js");
let GameShelfDB = require("../models/gameshelf.js");
let Game = require("../models/game.js");

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
    if (searchName) {
      searchName = encodeURIComponent(searchName);
      fetch(`https://api.geekdo.com/xmlapi/search?search=${searchName}`)
        .then((response) => response.text())
        .then((data) => {
          let jsonGames = convert.xml2json(data, {
            compact: true,
            spaces: 4,
          });
          jsonGames = JSON.parse(jsonGames);

          let games = [];

          // Check if the jsonGames object has the expected properties
          if (
            jsonGames &&
            jsonGames.boardgames &&
            jsonGames.boardgames.boardgame instanceof Array
          ) {
            // Iterate over the boardgame array
            jsonGames.boardgames.boardgame.forEach((bg) => {
              console.log("NAME: " + JSON.stringify(bg.name));
              console.log("YEAR: " + JSON.stringify(bg.yearpublished));
              const id = bg._attributes.objectid;
              const name = bg.name._text;
              if (bg.yearpublished) {
                var year = bg.yearpublished._text;
              }

              const game = new Game(
                id,
                year,
                null,
                null,
                null,
                name,
                null,
                null
              );
              games.push(game);
            });
          } else {
            res.status(400).send("Error occurred!");
          }

          res.status(200).json(games);
        })
        .catch((err) => {
          res.status(400).send(err.message);
        });
    } else {
      res.status(400).send("Error occurred!");
    }
  } catch (err) {
    res.status(400).send(err.message);
  }
});

module.exports = router;
