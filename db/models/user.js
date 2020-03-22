'use strict';

const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true,
    enum: ['user', 'admin'],
    default: 'admin'
  }
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

module.exports = mongoose.model('User', UserSchema);;