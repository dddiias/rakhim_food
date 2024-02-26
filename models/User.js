const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  birthdate: { type: Date, required: true },
  address: { type: String, required: true },
  phoneNumber: { type: String, required: true },
});

module.exports = mongoose.model('User', UserSchema);
