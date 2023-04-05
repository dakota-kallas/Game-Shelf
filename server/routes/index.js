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
      fetch(
        `https://api.boardgameatlas.com/api/search?pretty=true&client_id=byh1ZsZ8eh&name=$${searchName}&fields=id,name,average_user_rating,images,min_players,max_players,year_published`
      )
        .then((response) => response.json())
        .then((data) => {
          let games = [];

          if (data.games) {
            data.games.forEach((game) => {
              const currentGame = new Game(
                game.id,
                game.name,
                game.average_user_rating,
                game.images.small,
                game.min_players,
                game.max_players,
                game.year_published
              );
              games.push(currentGame);
            });
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