// const mongoose = require("mongoose");

// const UserSchema = new mongoose.Schema({
//   email: { type: String, unique: true },
//   password: { type: String, required: true },
//   firstName: { type: String, required: true },
//   lastName: { type: String, required: true },
//   enabled: { type: Boolean, default: true },
//   admin: { type: Boolean, default: false },
// });

// const User = mongoose.model("User", UserSchema);

// module.exports = {
//   User: User,
// };

const { v4: uuidv4 } = require("uuid");

const BY_EMAIL = {};
const BY_ID = {};

class User {
  constructor(email, password, firstName, lastName) {
    this.email = email;
    this.password = password;
    this.firstName = firstName;
    this.lastName = lastName;
    this.enabled = true;
    this.admin = false;
    this.id = uuidv4();

    BY_ID[this.id] = this;
    BY_EMAIL[this.email] = this;
  }
}

function getUsers() {
  let result = Object.values(BY_EMAIL);
  result.sort();
  return result
    .map((user) => Object.assign({}, user))
    .map((u) => delete u.password);
}

function getById(id) {
  let user = BY_ID[id];
  return user && Object.assign({}, user);
}

function getByEmail(email) {
  let user = BY_EMAIL[email];
  return user && Object.assign({}, user);
}

function isUser(obj) {
  return ["firstName", "lastName", "email", "password"].reduce(
    (acc, val) => obj.hasOwnProperty(val) && acc,
    true
  );
}

module.exports = {
  User: User,
  getByEmail: getByEmail,
  getById: getById,
  getUsers: getUsers,
  isUser: isUser,
};
