var express = require("express");
var router = express.Router();
const bcrypt = require("bcryptjs");
router.use(express.urlencoded({ extended: true }));

let UserDB = require("../models/user.js");
let GameShelfDB = require("../models/gameshelf.js");
let Game = require("../models/game.js");

const saltRounds = 10;
const BGAClientID = "byh1ZsZ8eh";

// UserDB.createUser(
//   "dakota@test.com",
//   bcrypt.hashSync("123", saltRounds),
//   "Dakota",
//   "Kallas",
//   true,
//   true
// )
//   .then((user) => {
//     console.log(`Created User document for email ${user.email}`);
//   })
//   .catch((error) => {
//     console.error("Error creating GameShelf document:", error);
//   });

// GameShelfDB.createGameShelf("dakota@test.com", [])
//   .then((gameshelf) => {
//     console.log(`Created GameShelf document for owner ${gameshelf.owner}`);
//   })
//   .catch((error) => {
//     console.error("Error creating GameShelf document:", error);
//   });

// UserDB.createUser(
//   "other@test.com",
//   bcrypt.hashSync("123", saltRounds),
//   "Test",
//   "User",
//   true,
//   false
// )
//   .then((user) => {
//     console.log(`Created User document for email ${user.email}`);
//   })
//   .catch((error) => {
//     console.error("Error creating GameShelf document:", error);
//   });

// GameShelfDB.createGameShelf("other@test.com", [])
//   .then((gameshelf) => {
//     console.log(`Created GameShelf document for owner ${gameshelf.owner}`);
//   })
//   .catch((error) => {
//     console.error("Error creating GameShelf document:", error);
//   });

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
router.get("/gameshelf", async function (req, res) {
  try {
    let gameshelf = await GameShelfDB.getByOwner(req.session.user.email);
    let idString = "";
    gameshelf.games.forEach(
      (bgaGameId) => (idString = `${idString},${bgaGameId}`)
    );
    if (idString != "") {
      fetch(
        `https://api.boardgameatlas.com/api/search?client_id=${BGAClientID}&ids=${idString}`
      )
        .then((response) => response.json())
        .then((data) => {
          if (data.games && data.games.length > 0) {
            let games = [];

            data.games.forEach((game) => {
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

            gameshelf.games = games;
            res.status(200).send(gameshelf);
          } else {
            res.status(404).send("Game(s) were not found, try again later.");
          }
        })
        .catch((err) => {
          res.status(400).send(err.message);
        });
    } else {
      res.status(200).send(gameshelf);
    }
  } catch (err) {
    res.status(400).send(err.message);
  }
});

/**
 * ADD TO GAMESHELF
 */
router.put("/gameshelf", async function (req, res) {
  try {
    const game = req.body.game;
    if (game) {
      let gameShelf = await GameShelfDB.getByOwner(req.session.user.email);
      if (
        gameShelf &&
        gameShelf.games.find((result) => result === game.bgaGameId)
      ) {
        res
          .status(409)
          .send("You already have the selected Game on your Shelf.");
      } else {
        let updatedShelf = await GameShelfDB.addGameToShelf(
          req.session.user.email,
          game.bgaGameId
        );
        let idString = "";
        if (updatedShelf.games) {
          updatedShelf.games.forEach(
            (bgaGameId) => (idString = `${idString},${bgaGameId}`)
          );
        }
        if (idString != "") {
          fetch(
            `https://api.boardgameatlas.com/api/search?client_id=${BGAClientID}&ids=${idString}`
          )
            .then((response) => response.json())
            .then((data) => {
              if (data.games && data.games.length > 0) {
                let games = [];

                data.games.forEach((game) => {
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

                updatedShelf.games = games;
                res.status(200).send(updatedShelf);
              } else {
                res
                  .status(404)
                  .send("Game(s) were not found, try again later.");
              }
            })
            .catch((err) => {
              res.status(400).send(err.message);
            });
        } else {
          res.status(200).send(updatedShelf);
        }
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
router.delete("/gameshelf/:gid", async function (req, res) {
  try {
    const bgaGameId = req.params.gid;
    if (bgaGameId) {
      let removedGameBGAId = await GameShelfDB.removeFromShelf(
        req.session.user.email,
        bgaGameId
      );
      fetch(
        `https://api.boardgameatlas.com/api/search?client_id=${BGAClientID}&ids=${removedGameBGAId}`
      )
        .then((response) => response.json())
        .then((data) => {
          if (data.games && data.games.length > 0) {
            const game = data.games[0];
            const removedGame = new Game(
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
            res.status(200).send(removedGame);
          } else {
            res.status(404).send("The game was not found, try again later.");
          }
        })
        .catch((err) => {
          res.status(400).send(err.message);
        });
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
router.get("/search", async function (req, res) {
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

router.get("/games/:gid", async function (req, res) {
  const bgaGameId = req.params.gid;
  fetch(
    `https://api.boardgameatlas.com/api/search?client_id=${BGAClientID}&ids=${bgaGameId}`
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
