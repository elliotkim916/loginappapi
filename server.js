'use strict';

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const app = express();

const passport = require('passport');
const {router: authRouter, localStrategy, jwtStrategy} = require('./auth');

const {router: usersRouter} = require('./users');

// const cors = require('cors');
const {
  // CLIENT_ORIGIN, 
  DATABASE_URL, 
  PORT
} = require('./config');

// app.use(
//   cors({
//     origin: CLIENT_ORIGIN
//   })
// );

passport.use(localStrategy);
passport.use(jwtStrategy);
app.use(passport.initialize());

app.use('/api/users/', usersRouter);
app.use('/api/auth', authRouter);

app.get('/', (req, res) => {
  return res.json({
    message: 'This is node.js role based authentication system'
  });
});

let server;

function runServer(databaseUrl, port=PORT) {
  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, err => {
      if (err) {
        return reject(err);
      }

      server = app.listen(port, () => {
        console.log(`listening on port ${port}`);
        resolve();
      })
        .on('error', err => {
          mongoose.disconnect();
          reject(err);
        });
    });
  });
}

function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      server.close(err => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  });
}

if (require.main === module) {
  runServer(DATABASE_URL).catch(err => err);
};

module.exports = {app, runServer, closeServer};