// this is where im going to make connection to db
'use strict';

const mongoose = require('mongoose');
const {DATABASE_URL} = require('../config');

const connectDb = async () => {
  try {
    console.log('Connecting to db');
    
    return await mongoose.connect(DATABASE_URL, {
      useNewUrlParser: true,
      auth: { authSource: 'admin'},
      user: process.env.MONGO_INITDB_ROOT_USERNAME,
      pass: process.env.MONGO_INITDB_ROOT_PASSWORD
    });
  } catch(e) {
    console.log(`Error on connection to DB ${e}`);
  }
}

module.exports = connectDb;