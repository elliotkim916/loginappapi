'use strict';

const jwt = require('jsonwebtoken');
const config = require('../../config');

const createAuthToken = user => {
  return jwt.sign({user}, config.JWT_SECRET, {
    subject: user.username,
    expiresIn: config.JWT_EXPIRY,
    algorithm: 'HS256'
  });
};

module.exports = {
  login: async (req, res) => {
    const {_id} = req.user;
    const authToken = createAuthToken(req.user.serialize());
    res.json({authToken, _id});
  },
  refresh: async (req, res) => {
    const authToken = createAuthToken(req.user);
    res.json({authToken});
  }
};