const mongoose = require("mongoose");

const GameShelfSchema = new mongoose.Schema(
  {
    owner: { type: String, required: true, unique: true },
    games: { type: [String], required: true, default: [] },
  },
  { versionKey: false }
);

const GameShelf = mongoose.model("GameShelf", GameShelfSchema);

async function createGameShelf(owner, games) {
  const gameshelf = new GameShelf({ owner, games });
  await gameshelf.save();
  return gameshelf.toObject();
}

async function getByOwner(owner) {
  const gameshelf = await GameShelf.findOne({ owner });
  return gameshelf && gameshelf.toObject();
}

async function addGameToShelf(owner, bggGameId) {
  const gameshelf = await GameShelf.findOne({ owner });
  if (!gameshelf) {
    throw new Error("GameShelf not found");
  }
  gameshelf.games.push(bggGameId);
  await gameshelf.save();
  return gameshelf.toObject();
}

async function removeFromShelf(owner, bggGameId) {
  const gameshelf = await GameShelf.findOne({ owner });
  if (!gameshelf) {
    throw new Error("GameShelf not found");
  }
  gameshelf.games = gameshelf.games.filter((gameId) => gameId !== bggGameId);
  await gameshelf.save();
  return bggGameId;
}

module.exports = {
  GameShelf: GameShelf,
  createGameShelf: createGameShelf,
  getByOwner: getByOwner,
  addGameToShelf: addGameToShelf,
  removeFromShelf: removeFromShelf,
};
