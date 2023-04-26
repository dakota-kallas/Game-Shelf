var express = require("express");
var router = express.Router();
const bcrypt = require("bcryptjs");
router.use(express.urlencoded({ extended: true }));

let UserDB = require("../models/user.js");
let GameShelfDB = require("../models/gameshelf.js");
let GameLogDB = require("../models/gamelog.js");
let Game = require("../models/game.js");

const saltRounds = 10;
const BGAClientID = "byh1ZsZ8eh";

// makeMockData();

// ROUTES

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
 * UPDATE USER DETAILS
 */
router.put("/users", async (req, res) => {
  if (req.session.user._id == req.body.user._id || req.session.user.admin) {
    try {
      let enabled = true;
      let admin = false;
      let password = null;

      // If the current session user is an admin, allow for enabled & admin to be changed.
      if (req.session.user.admin) {
        enabled = req.body.enabled;
        admin = req.body.admin;
      }

      if (req.body.password && validatePassword(req.body.password)) {
        password = bcrypt.hashSync(req.body.password, 10);
      } else if (req.body.password != "") {
        throw new Error("Password must be at least 8 characters.");
      }

      let updatedUser = await UserDB.updateUser(
        req.body.firstName,
        req.body.lastName,
        enabled,
        admin,
        password,
        req.body.user
      );
      updatedUser = await UserDB.getByEmail(req.body.user.email);
      delete updatedUser.password;

      // If the current session user is not an admin, update the session user.
      if (!req.session.user.admin) {
        req.session.user = updatedUser;
      }

      res.status(200).send(updatedUser);
    } catch (err) {
      res.status(403).send(err.message);
    }
  } else {
    res.status(403).send("Unable to update user, try again later.");
  }
});

/**
 * GET ALL USERS
 */
router.get("/users", async (req, res) => {
  if (req.session.user.admin) {
    try {
      let users = await UserDB.getUsers();
      res.status(200).send(users);
    } catch (err) {
      res.status(409).send(err.message);
    }
  } else {
    res.status(409).send("Unable to obtain users, try again later.");
  }
});

/**
 * GET ALL USERS
 */
router.get("/users/:uid", async (req, res) => {
  const userId = req.params.uid;
  try {
    if (req.session.user.admin || req.session.user._id == userId) {
      let user = await UserDB.getById(userId);
      delete user.password;
      res.status(200).send(user);
    } else {
      throw new Error("Unable to retrieve user, try again later.");
    }
  } catch (err) {
    res.status(409).send(err.message);
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
      let games = await getGames(idString, gameshelf.games.length);
      if (games) {
        gameshelf.games = games;
      } else {
        throw Error(
          "There was an issue collecting the Game Shelf, try again later."
        );
      }
    }

    res.status(200).send(gameshelf);
  } catch (err) {
    res.status(404).send(err.message);
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
          let games = await getGames(idString, updatedShelf.games.length);
          if (games) {
            updatedShelf.games = games;
            res.status(200).send(updatedShelf);
          } else {
            throw Error(
              "There was an issue providing the game, try again later."
            );
          }
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

      let games = await getGames(removedGameBGAId);
      if (games) {
        res.status(200).send(games[0]);
      } else {
        throw Error("There was an issue removing the game, try again later.");
      }
    } else {
      throw Error("There was an issue providing the game, try again later.");
    }
  } catch (err) {
    res.status(404).send(err.message);
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
      searchParam = `&name=${encodeURIComponent(searchName)}&limit=30`;
    } else if (orderBy) {
      orderParam = `&order_by=${orderBy}&limit=10`;
    }
    let fetchURL = `https://api.boardgameatlas.com/api/search?client_id=${BGAClientID}${searchParam}${orderParam}`;
    fetch(fetchURL)
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

        res.setHeader("Search-Count", games.length);
        res.status(200).json(games);
      })
      .catch((err) => {
        res.status(400).send(err.message);
      });
  } else {
    res.status(400).send("Error occurred!");
  }
});

/**
 * GET GAME DETAILS
 */
router.get("/games/:gid", async function (req, res) {
  const bgaGameId = req.params.gid;
  let games = await getGames(bgaGameId);
  if (games) {
    res.status(200).send(games[0]);
  } else {
    res.status(400).send("Unable to retrieve game details, try again later.");
  }
});

/**
 * GET GAME LOGS FOR CURRENT USER
 */
router.get("/gamelogs", async function (req, res) {
  let gameLogs = await GameLogDB.getByOwner(req.session.user.email);
  if (gameLogs) {
    res.status(200).send(gameLogs);
  } else {
    res.status(400).send("Unable to retrieve game logs, try again later.");
  }
});

/**
 * GET GAME LOG DETAILS
 */
router.get("/gamelogs/:glid", async function (req, res) {
  const gameLogId = req.params.glid;
  let gameLog = await GameLogDB.getById(gameLogId);
  if (gameLog && gameLog.owner == req.session.user.email) {
    res.status(200).send(gameLogs);
  } else {
    res
      .status(400)
      .send("Unable to retrieve game log details, try again later.");
  }
});

/**
 * DELETE GAME LOG
 */
router.delete("/gamelogs/:glid", async function (req, res) {
  try {
    const gameLogId = req.params.glid;
    if (gameLogId) {
      let removedGameLogId = await GameLogDB.removeGameLog(
        gameLogId,
        req.session.user.email
      );

      if (removedGameLogId) {
        res.status(200).send(removedGameLogId);
      } else {
        throw Error(
          "There was an issue removing the game log, try again later."
        );
      }
    } else {
      throw Error(
        "There was an issue providing the game log, try again later."
      );
    }
  } catch (err) {
    res.status(404).send(err.message);
  }
});

/**
 * UPDATE GAME LOG
 */
router.put("/gamelogs/:glid", async function (req, res) {
  try {
    const gameLog = req.body.gameLog;
    const gameLogId = req.params.glid;
    if (gameLog && gameLogId && gameLogId == gameLog._id) {
      let updatedGameLog = await GameLogDB.updateGameLog(
        gameLog,
        req.session.user.email
      );

      if (updatedGameLog) {
        res.status(200).send(updatedGameLog);
      } else {
        throw Error(
          "There was an issue updating the game log, try again later."
        );
      }
    } else {
      throw Error("There was an issue providing the game, try again later.");
    }
  } catch (err) {
    res.status(400).send(err.message);
  }
});

/**
 * CREATE A GAME LOG
 */
router.post("/gamelogs", upload.none(), async (req, res) => {
  const bgaGameId = req.body.bgaGameId;
  const date = req.body.date;
  const note = req.body.note;
  const rating = req.body.rating;

  try {
    if (!bgaGameId || !date) {
      throw new Error("Please provide all required fields.");
    }

    let newGameLog = await GameLogDB.createGameLog(
      req.session.user.email,
      bgaGameId,
      date,
      note,
      rating
    );

    if (newGameLog) {
      res.status(200).send(newGameLog);
    } else {
      throw new Error(
        "There was an issue creating the game log, try again later."
      );
    }
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// HELPER METHODS

/**
 * Helper method used to fetch game(s) from the BoardGameAtlas API
 * @param {String[]} idListString
 * @param {Number} numGames
 * @returns {Game[]}
 */
async function getGames(idListString, numGames) {
  return fetch(
    `https://api.boardgameatlas.com/api/search?client_id=${BGAClientID}&ids=${idListString}&limit=${numGames}`
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
        return games;
      } else {
        return null;
      }
    })
    .catch((err) => {
      return null;
    });
}

function validatePassword(password) {
  if (password.length < 8) {
    return false;
  }

  if (/\s/.test(password)) {
    return false;
  }

  return true;
}

/**
 * Function used to create initial data in database
 */
function makeMockData() {
  UserDB.createUser(
    "dakota@test.com",
    bcrypt.hashSync("123", saltRounds),
    "Dakota",
    "Kallas",
    true,
    true
  )
    .then((user) => {
      console.log(`Created User document for email ${user.email}`);
    })
    .catch((error) => {
      console.error("Error creating GameShelf document:", error);
    });

  GameShelfDB.createGameShelf("dakota@test.com", [])
    .then((gameshelf) => {
      console.log(`Created GameShelf document for owner ${gameshelf.owner}`);
    })
    .catch((error) => {
      console.error("Error creating GameShelf document:", error);
    });

  UserDB.createUser(
    "other@test.com",
    bcrypt.hashSync("123", saltRounds),
    "Test",
    "User",
    true,
    false
  )
    .then((user) => {
      console.log(`Created User document for email ${user.email}`);
    })
    .catch((error) => {
      console.error("Error creating GameShelf document:", error);
    });

  GameShelfDB.createGameShelf("other@test.com", [])
    .then((gameshelf) => {
      console.log(`Created GameShelf document for owner ${gameshelf.owner}`);
    })
    .catch((error) => {
      console.error("Error creating GameShelf document:", error);
    });
}

module.exports = router;
