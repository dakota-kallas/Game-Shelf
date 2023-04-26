const mongoose = require("mongoose");

const GameLogSchema = new mongoose.Schema(
  {
    owner: { type: String, required: true },
    bgaGameId: { type: String, required: true },
    date: { type: String, required: true },
    note: { type: String },
    rating: { type: Number },
  },
  { versionKey: false }
);

const GameLog = mongoose.model("GameLog", GameLogSchema);

async function createGameLog(owner, bgaGameId, date, note, rating) {
  const gameLog = new GameLog({ owner, bgaGameId, date, note, rating });
  await gameLog.save();
  return gameLog.toObject();
}

async function getByOwner(owner) {
  const gameLog = await GameLog.findOne({ owner });
  return gameLog && gameLog.toObject();
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
  gameLog = updatedGameLog;

  await gameLog.save();
  return gameLog.toObject();
}

async function removeGameLog(gameLogId, owner) {
  const gameLog = await GameLog.findOne({ _id: gameLogId, owner });
  if (!gameLog) {
    throw new Error("Game Log not found.");
  }

  await GameLog.deleteOne({ _id: gameLogId });
  return gameLogId;
}

module.exports = {
  GameLog: GameLog,
  createGameLog: createGameLog,
  getByOwner: getByOwner,
  getById: getById,
  updateGameLog: updateGameLog,
  removeGameLog: removeGameLog,
};
