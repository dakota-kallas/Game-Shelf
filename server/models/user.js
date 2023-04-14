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

async function updateUser(firstName, lastName, enabled, admin, user) {
  try {
    const existingUser = await User.findById(user._id);

    if (!existingUser) {
      throw new Error("User not found");
    }

    existingUser.firstName = firstName;
    existingUser.lastName = lastName;
    existingUser.enabled = enabled;
    existingUser.admin = admin;

    await existingUser.save();
    return existingUser.toObject();
  } catch (error) {
    throw new Error(`Failed to update user: ${error.message}`);
  }
}

async function getByEmail(email) {
  const user = await User.findOne({ email });
  return user && user.toObject();
}

async function getById(_id) {
  const user = await User.findOne({ _id });
  return user && user.toObject();
}

async function getUsers() {
  const users = await User.find().select("-password");
  return users && users.map((user) => user.toObject());
}

module.exports = {
  User: User,
  updateUser: updateUser,
  getById: getById,
  getByEmail: getByEmail,
  getUsers: getUsers,
  createUser: createUser,
};
