'use strict';

const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const UserSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
  // role: {
  //   type: String,
  //   required: true,
  //   enum: ['user', 'admin']
  //   // only save if one of them is in the list
  // }
});

UserSchema.methods.serialize = function() {
  return {
    username: this.username,
    _id: this._id
  };
};

UserSchema.methods.validatePassword = function(password) {
  return bcrypt.compare(password, this.password);
};

UserSchema.methods.hashPassword = function(password) {
  return bcrypt.hash(password, 10);
};

const User = mongoose.model('User', UserSchema);

module.exports = {User};