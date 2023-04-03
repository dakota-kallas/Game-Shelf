const mongoose = require("mongoose");

const GameShelfSchema = new mongoose.Schema({
  owner: { type: String, required: true, unique: true },
  games: { type: [Number], required: true, default: [] },
});

const GameShelf = mongoose.model("GameShelf", GameShelfSchema);

module.exports = {
  GameShelf: GameShelf,
};
