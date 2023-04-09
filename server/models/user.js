const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, unique: true },
    password: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    enabled: { type: Boolean, default: true },
    admin: { type: Boolean, default: false },
  },
  { versionKey: false }
);

const User = mongoose.model("User", UserSchema);

async function createUser(
  email,
  password,
  firstName,
  lastName,
  enabled,
  admin
) {
  const user = new User({
    email,
    password,
    firstName,
    lastName,
    enabled,
    admin,
  });
  await user.save();
  return user.toObject();
}

async function getByEmail(email) {
  const user = await User.findOne({ email });
  return user && user.toObject();
}

async function getUsers() {
  const users = await User.findAll();
  return users && users.toObject();
}

module.exports = {
  User: User,
  getByEmail: getByEmail,
  getUsers: getUsers,
  createUser: createUser,
};
