const mongoose = require("mongoose");

const GameLogSchema = new mongoose.Schema(
  {
    owner: { type: String, required: true },
    bggGameId: { type: String, required: true },
    bgaGameName: { type: String, required: true },
    date: { type: String, required: true },
    note: { type: String },
    rating: { type: Number },
  },
  { versionKey: false }
);

const GameLog = mongoose.model("GameLog", GameLogSchema);

async function createGameLog(
  owner,
  bggGameId,
  bgaGameName,
  date,
  note,
  rating
) {
  const gameLog = new GameLog({
    owner,
    bggGameId,
    bgaGameName,
    date,
    note,
    rating,
  });
  await gameLog.save();
  return gameLog.toObject();
}

async function getByOwner(owner) {
  const gameLogs = await GameLog.find({ owner }).sort({
    date: "desc",
    bgaGameName: "asc",
  });
  return gameLogs.map((gameLog) => gameLog.toObject());
}

async function getByBGAGame(bggGameId, owner) {
  const gameLogs = await GameLog.find({ owner, bggGameId }).sort({
    date: "desc",
  });
  return gameLogs.map((gameLog) => gameLog.toObject());
}

async function getById(_id) {
  const gameLog = await GameLog.findOne({ _id });
  return gameLog && gameLog.toObject();
}

async function updateGameLog(updatedGameLog, owner) {
  let gameLog = await GameLog.findOne({ _id: updatedGameLog._id, owner });
  if (!gameLog) {
    throw new Error("Game Log not found.");
  }

  gameLog.date = updatedGameLog.date.toString();
  gameLog.note = updatedGameLog.note;
  gameLog.rating = updatedGameLog.rating;

  await gameLog.save();
  return gameLog.toObject();
}

async function removeGameLog(gameLogId, owner) {
  const gameLog = await GameLog.findOne({ _id: gameLogId, owner });
  if (!gameLog) {
    throw new Error("Game Log not found.");
  }

  await GameLog.deleteOne({ _id: gameLogId });
  return gameLog;
}

module.exports = {
  GameLog: GameLog,
  createGameLog: createGameLog,
  getByOwner: getByOwner,
  getByBGAGame: getByBGAGame,
  getById: getById,
  updateGameLog: updateGameLog,
  removeGameLog: removeGameLog,
};
