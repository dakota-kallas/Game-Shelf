const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  enabled: { type: Boolean, default: true },
  admin: { type: Boolean, default: false },
});

const User = mongoose.model("User", UserSchema);

module.exports = {
  User: User,
};
