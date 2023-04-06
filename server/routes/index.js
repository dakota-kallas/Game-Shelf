var express = require("express");
var router = express.Router();
const bcrypt = require("bcryptjs");
const convert = require("xml-js");
router.use(express.urlencoded({ extended: true }));

let UserDB = require("../models/user.js");
let GameShelfDB = require("../models/gameshelf.js");
let Game = require("../models/game.js");

const saltRounds = 10;
const BGAClientID = "byh1ZsZ8eh";

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
 * SEARCH GAMES
 * Order_by Ex. rank, trending, plays (also limit?)
 */
router.get("/search", function (req, res) {
  const searchName = req.query.name;
  const orderBy = req.query.orderBy;
  if (searchName || orderBy) {
    let orderParam = "";
    let searchParam = "";
    if (searchName) {
      searchParam = `&name=$${encodeURIComponent(searchName)}`;
    }
    if (orderBy) {
      orderParam = `&order_by=${orderBy}`;
    }
    fetch(
      `https://api.boardgameatlas.com/api/search?client_id=${BGAClientID}${searchParam}${orderParam}`
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
});

module.exports = router;
