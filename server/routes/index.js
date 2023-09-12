var express = require("express");
var router = express.Router();
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const { parseString } = require("xml2js");
router.use(express.urlencoded({ extended: true }));

let UserDB = require("../models/user.js");
let GameShelfDB = require("../models/gameshelf.js");
let GameLogDB = require("../models/gamelog.js");
let Game = require("../models/game.js");
require("dotenv").config({ path: "./.env" });

const saltRounds = 10;

// makeMockData();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GOOGLE_CONTACT_EMAIL,
    pass: process.env.GOOGLE_CONTACT_PASS,
  },
});

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

      if (req.body.password && req.body.user.issuer != "local") {
        throw new Error("Cannot update 3rd party account managed password.");
      }

      if (req.session.user.admin && req.body.password) {
        password = generateTemporaryPassword(10);

        const mailOptions = {
          from: '"Game Shelf" <dkgameshelf@gmail.com>',
          to: req.body.user.email,
          subject: "Game Shelf: Temporary Password Change",
          text: `Your new temporary password is: ${password} \n\n Have questions? Contact us! (<a href="mailto:contact@dakotakallas.dev">contact@dakotakallas.dev</a>)`,
          html: `
    <p>Your new temporary password is: <strong>${password}</strong></p>
    <hr />
    <p>Have questions? Contact us! (<a href="mailto:contact@dakotakallas.dev">contact@dakotakallas.dev</a>)</p>
  `,
        };
        password = bcrypt.hashSync(password, 10);

        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            throw new Error("Error generating password.");
          }
        });
      } else if (req.body.password && validatePassword(req.body.password)) {
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
      (bggGameId) => (idString = `${idString},${bggGameId}`)
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
        gameShelf.games.find((result) => result === game.bggGameId)
      ) {
        res
          .status(409)
          .send("You already have the selected Game on your Shelf.");
      } else {
        let updatedShelf = await GameShelfDB.addGameToShelf(
          req.session.user.email,
          game.bggGameId
        );
        let idString = "";
        if (updatedShelf.games) {
          updatedShelf.games.forEach(
            (bggGameId) => (idString = `${idString},${bggGameId}`)
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
    const bggGameId = req.params.gid;
    if (bggGameId) {
      let removedGameBGAId = await GameShelfDB.removeFromShelf(
        req.session.user.email,
        bggGameId
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
    try {
      let limit = 40;

      let fetchURL = `https://boardgamegeek.com/xmlapi2/search?type=boardgame&query=${encodeURIComponent(
        searchName
      )}`;

      if (orderBy) {
        fetchURL = `https://boardgamegeek.com/xmlapi2/hot?type=boardgame`;
        limit = 10;
      }

      const response = await fetch(fetchURL);
      if (!response.ok) {
        throw new Error(`Error fetching data: ${response.statusText}`);
      }
      const xmlText = await response.text();
      const result = await new Promise((resolve, reject) => {
        parseString(xmlText, (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        });
      });

      let count = 0;
      let gamesIdString = "";
      let games = [];

      if (result && result.items.item) {
        result.items.item.some((item) => {
          if (count >= limit) {
            return true;
          }
          gamesIdString += `${item.$.id},`;
          count++;
          return false;
        });

        let gamesFetchURL = `https://boardgamegeek.com/xmlapi2/thing?id=${gamesIdString}&stats=1`;
        const gamesResponse = await fetch(gamesFetchURL);
        if (!gamesResponse.ok) {
          throw new Error(
            `Error fetching games data: ${gamesResponse.statusText}`
          );
        }
        const gamesXmlText = await gamesResponse.text();
        const gamesResult = await new Promise((resolve, reject) => {
          parseString(gamesXmlText, (err, result) => {
            if (err) {
              reject(err);
            } else {
              resolve(result);
            }
          });
        });

        if (gamesResult && gamesResult.items.item) {
          gamesResult.items.item.forEach((item) => {
            let publisher = null;
            item.link.some((item) => {
              if (item.$ && item.$.type === "boardgamepublisher") {
                publisher = item.$.value;
                return true;
              }
              return false;
            });

            const currentGame = new Game({
              id: item.$.id,
              name: item.name[0].$.value,
              description: item.description[0],
              image: item.thumbnail[0],
              thumbnail: item.image[0],
              minPlayers: item.minplayers[0].$.value,
              maxPlayers: item.maxplayers[0].$.value,
              playtime: item.playingtime[0].$.value,
              minAge: item.minage[0].$.value,
              year: item.yearpublished[0].$.value,
              publisher: publisher,
              rating:
                Math.round(
                  (parseFloat(
                    item.statistics[0].ratings[0].average[0].$.value
                  ) /
                    2) *
                    2
                ) / 2,
            });
            games.push(currentGame);
          });
        }
      }

      res.setHeader("Search-Count", count ?? 0);
      res.status(200).json(games);
    } catch (error) {
      console.error("Error occurred:", error);
      res.setHeader("Search-Count", 0);
      res.status(500).send("Internal server error");
    }
  } else {
    res.setHeader("Search-Count", 0);
    res.status(400).send("Error occurred!");
  }
});

/**
 * GET GAME DETAILS
 */
router.get("/games/:gid", async function (req, res) {
  const bggGameId = req.params.gid;
  let games = await getGames(bggGameId);
  if (games) {
    res.status(200).send(games[0]);
  } else {
    res.status(400).send("Unable to retrieve game details, try again later.");
  }
});

/**
 * GET GAME LOGS
 */
router.get("/gamelogs", async function (req, res) {
  const bggGameId = req.query.bggGameId;
  let gameLogs = null;
  if (bggGameId) {
    gameLogs = await GameLogDB.getByBGAGame(bggGameId, req.session.user.email);
  } else {
    gameLogs = await GameLogDB.getByOwner(req.session.user.email);
  }

  if (gameLogs) {
    res.status(200).send(gameLogs);
  } else {
    res.status(200).send("Unable to retrieve game logs, try again later.");
  }
});

/**
 * GET GAME LOG DETAILS
 */
router.get("/gamelogs/:glid", async function (req, res) {
  const gameLogId = req.params.glid;
  let gameLog = await GameLogDB.getById(gameLogId);
  if (gameLog && gameLog.owner == req.session.user.email) {
    res.status(200).send(gameLog);
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
      let removedGameLog = await GameLogDB.removeGameLog(
        gameLogId,
        req.session.user.email
      );

      if (removedGameLog) {
        res.status(200).send(removedGameLog);
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
router.post("/gamelogs", async (req, res) => {
  const bggGameId = req.body.bggGameId;
  const bgaGameName = req.body.bgaGameName;
  const date = req.body.date;
  const note = req.body.note;
  const rating = req.body.rating;

  try {
    if (!bggGameId || !date) {
      throw new Error("Please provide all required fields.");
    }

    let newGameLog = await GameLogDB.createGameLog(
      req.session.user.email,
      bggGameId,
      bgaGameName,
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
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch(
        `https://boardgamegeek.com/xmlapi2/thing?id=${idListString}&stats=1`
      );

      if (!response.ok) {
        throw new Error(`Error fetching data: ${response.statusText}`);
      }

      const xmlText = await response.text();
      parseString(xmlText, (err, result) => {
        if (err) {
          reject(err);
        } else {
          let games = [];
          if (result && result.items.item) {
            result.items.item.forEach((item) => {
              if (games.length >= numGames) {
                resolve(games);
              }
              let publisher = null;
              item.link.some((item) => {
                if (item.$ && item.$.type === "boardgamepublisher") {
                  publisher = item.$.value;
                  return true;
                }
                return false;
              });

              const currentGame = new Game({
                id: item.$.id,
                name: item.name[0].$.value,
                description: item.description[0],
                image: item.thumbnail[0],
                thumbnail: item.image[0],
                minPlayers: item.minplayers[0].$.value,
                maxPlayers: item.maxplayers[0].$.value,
                playtime: item.playingtime[0].$.value,
                minAge: item.minage[0].$.value,
                year: item.yearpublished[0].$.value,
                publisher: publisher,
                rating:
                  Math.round(
                    (parseFloat(
                      item.statistics[0].ratings[0].average[0].$.value
                    ) /
                      2) *
                      2
                  ) / 2,
                rank: item.statistics[0].ratings[0].ranks[0].rank[0].$.value,
              });
              games.push(currentGame);
            });
          }

          resolve(games);
        }
      });
    } catch (error) {
      reject(error);
    }
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

/**
 * Generate a random password string
 * @param {number} length
 * @returns A string
 */
function generateTemporaryPassword(length) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let password = "";
  for (let i = 0; i < length; i++) {
    password += characters.charAt(
      Math.floor(Math.random() * characters.length)
    );
  }
  return password;
}

module.exports = router;
