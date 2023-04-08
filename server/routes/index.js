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
router.get("/gameshelf", function (req, res) {
  try {
    let gameshelf = GameShelfDB.getByOwner(req.session.user.email);
    res.status(200).send(gameshelf);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

/**
 * ADD TO GAMESHELF
 */
router.put("/gameshelf", function (req, res) {
  try {
    const game = req.body.game;
    if (game) {
      let gameShelf = GameShelfDB.getByOwner(req.session.user.email);
      if (
        gameShelf &&
        gameShelf.games.find((result) => result._id === game._id)
      ) {
        res
          .status(409)
          .send("You already have the selected Game on your Shelf.");
      } else {
        let updatedShelf = GameShelfDB.addGameToShelf(
          req.session.user.email,
          game
        );
        res.status(200).json(updatedShelf);
      }
    } else {
      throw Error("There was an issue providing the game, try again later.");
    }
  } catch (err) {
    res.status(400).send(err.message);
  }
});

/**
 * REMOVE FROM GAMESHELF
 */
router.delete("/gameshelf/:gid", function (req, res) {
  try {
    const gameId = req.params.gid;
    if (gameId) {
      let updatedShelf = GameShelfDB.removeFromShelf(
        req.session.user.email,
        gameId
      );
      res.status(200).json(updatedShelf);
    } else {
      throw Error("There was an issue providing the game, try again later.");
    }
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
      orderParam = `&order_by=${orderBy}&limit=10`;
    }
    fetch(
      `https://api.boardgameatlas.com/api/search?client_id=${BGAClientID}${searchParam}${orderParam}`
    )
      .then((response) => response.json())
      .then((data) => {
        let games = [];

        if (data.games) {
          data.games.forEach((game) => {
            console.log(game.image_url);
            const currentGame = new Game(
              game.id,
              game.name,
              Math.round(game.average_user_rating * 2) / 2,
              game.images.small,
              game.image_url,
              game.min_players,
              game.max_players,
              game.year_published,
              game.playtime ?? "--",
              game.plays,
              game.rank,
              game.trending_rank,
              game.description,
              game.min_age,
              game.rules_url,
              game.primary_publisher?.name
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

router.get("/games/:gid", function (req, res) {
  const gameId = req.params.gid;
  fetch(
    `https://api.boardgameatlas.com/api/search?client_id=${BGAClientID}&ids=${gameId}`
  )
    .then((response) => response.json())
    .then((data) => {
      if (data.games && data.games.length > 0) {
        const game = data.games[0];
        const currentGame = new Game(
          game.id,
          game.name,
          Math.round(game.average_user_rating * 2) / 2,
          game.images.small,
          game.image_url,
          game.min_players,
          game.max_players,
          game.year_published,
          game.playtime ?? "--",
          game.plays,
          game.rank,
          game.trending_rank,
          game.description,
          game.min_age,
          game.rules_url,
          game.primary_publisher?.name
        );
        res.status(200).send(currentGame);
      } else {
        res.status(404).send("The game was not found, try again later.");
      }
    })
    .catch((err) => {
      res.status(400).send(err.message);
    });
});

module.exports = router;
