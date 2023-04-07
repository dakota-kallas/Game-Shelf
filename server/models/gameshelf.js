// const mongoose = require("mongoose");

// const GameShelfSchema = new mongoose.Schema({
//   owner: { type: String, required: true, unique: true },
//   games: { type: [Number], required: true, default: [] },
// });

// const GameShelf = mongoose.model("GameShelf", GameShelfSchema);

// module.exports = {
//   GameShelf: GameShelf,
// };

const { v4: uuidv4 } = require("uuid");

const BY_OWNER = {};

class GameShelf {
  constructor(owner, games) {
    this.owner = owner;
    this.games = games;
    this._id = uuidv4();

    BY_OWNER[this.owner] = this;
  }
}

function getByOwner(owner) {
  let gameshelf = BY_OWNER[owner];
  return gameshelf && Object.assign({}, gameshelf);
}

function isGameShelf(obj) {
  return ["owner", "games"].reduce(
    (acc, val) => obj.hasOwnProperty(val) && acc,
    true
  );
}

function addGameToShelf(owner, game) {
  BY_OWNER[owner].games.push(Object.assign({}, game));
  let gameshelf = BY_OWNER[owner];
  return gameshelf && Object.assign({}, gameshelf);
}

function removeFromShelf(owner, gameId) {
  let game = Object.assign(
    {},
    BY_OWNER[owner].games.find((game) => game._id === gameId)
  );
  BY_OWNER[owner].games = BY_OWNER[owner].games.filter(
    (game) => game._id !== gameId
  );
  return game;
}

module.exports = {
  GameShelf: GameShelf,
  getByOwner: getByOwner,
  isGameShelf: isGameShelf,
  addGameToShelf: addGameToShelf,
  removeFromShelf: removeFromShelf,
};
