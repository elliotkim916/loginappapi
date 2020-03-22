// this is just for logging in & refreshing tokens
'use strict';

const router = require('express').Router();
const authController = require('../controllers/authController');
const passport = require('passport');

const localAuth = passport.authenticate('local', {session: false});
const jwtAuth = passport.authenticate('jwt', {session: false});

router
  .route('/login')
  .all(localAuth)
  .post(authController.login);  

router 
  .route('/refresh')
  .all(jwtAuth)
  .post(authController.refresh);

module.exports = router;