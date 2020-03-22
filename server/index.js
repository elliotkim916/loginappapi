// this is where I import middleware, routers, connect to db & then listening to the server
'use strict';

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const passport = require('passport');
const {PORT} = require('../config');
const {localStrategy, jwtStrategy} = require('../auth/strategies');
const bodyParser = require('body-parser');
const authRouter = require('./routes/authRoutes');
const userRouter = require('./routes/userRoutes');
const connectToDb = require('../db');
const cors = require('cors');

app.use(bodyParser.json());
app.use(cors());

passport.use(localStrategy);
passport.use(jwtStrategy);
app.use(passport.initialize());

app.use('/api/users', userRouter);
app.use('/api/auth', authRouter);

connectToDb()
  .then(() => app.listen(PORT))
  .catch((e) => console.log(e));