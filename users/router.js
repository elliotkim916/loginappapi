'use strict';

const express = require('express');
const router = express.Router();
const {User} = require('./models');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

// post request to register a new user
router.post('/', jsonParser, (req, res) => {
  console.log('req', req);
  console.log('res', res);
  // checking for required fields
  const requiredFields = ['username', 'password'];
  const missingField = requiredFields.find(field => !(field in req.body));

  if (missingField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Missing field',
      location: missingField
    });
  }

  // checking that all fields are strings
  const stringFields = ['username', 'password'];
  const nonStringField = stringFields.find(field => field in req.body && typeof req.body[field] !== 'string');

  if (nonStringField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Incorrect field type: expected string',
      location: nonStringField
    });
  }

  // checking that all fields are trimmed with no whitespace
  const explicitlyTrimmedFields = ['username', 'password'];
  const nonTrimmedField = explicitlyTrimmedFields.find(field => req.body[field].trim() !== req.body[field]);

  if (nonTrimmedField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Cannot start or end with whitespace',
      location: nonTrimmedField
    });
  }

  // checking fields are correct length
  const sizedFields = {
    username: {
      min: 1
    },
    password: {
      min: 7,
      max: 25
    }
  };

  const tooSmallField = Object.keys(sizedFields).find(field => 'min' in sizedFields[field] && req.body[field].trim().length < sizedFields[field].min);
  const tooLargeField = Object.keys(sizedFields).find(field => 'max' in sizedFields[field] && req.body[field].trim().length > sizedFields[field].max);

  if (tooSmallField || tooLargeField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: tooSmallField
        ? `Must be at least ${sizedFields[tooSmallField].min} characters long`
        : `Must be at most ${sizedFields[tooLargeField].max} characters long`,
      location: tooSmallField || tooLargeField
    });
  }

  let {
    username, 
    password 
    // role
  } = req.body;

  return User
    .find({username})
    .count()
    .then(count => {
      if (count > 0) {
        return Promise.reject({
          code: 422,
          reason: 'ValidationError',
          message: 'Username already taken',
          location: 'username'
        });
      }

      return User.hashPassword(password);
    })
    .then(hash => {
      return User.create({
        username,
        password: hash
      })
        .then(user => {
          return res.status(201).json(user.serialize());
        })
        .catch(err => {
          if (err.reason === 'ValidationError') {
            return res.status(err.code).json(err);
          }
          res.status(500).json({code: 500, message: 'Internal server error'});
        });
    });
});

module.exports = {router};