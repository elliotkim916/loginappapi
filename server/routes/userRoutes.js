// this is for routing user related requests
'use strict';

const router = require('express').Router();
const userController = require('../controllers/userController');
const passport = require('passport');

const jwtAuth = passport.authenticate('jwt', {session: false});

router
  .route('/edit/:id')
  .post(userController.editUserById);  

router 
  .route('/:id')
  .all(jwtAuth)
  .get(userController.getUserById);
  
router
  .route('/')
  .post(userController.createUser)
  .all(jwtAuth)
  .get(userController.getAllUsers);
  
module.exports = router;