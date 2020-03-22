'use strict';

const User = require('../../db/models/user');
const bcrypt = require('bcrypt');

module.exports = {
  getAllUsers: async (req, res) => {
    let allUsers;

    try {
      allUsers = await User.find();
    } catch(e) {
      console.log(e);
      return res.status(404).send(e);
    }
    res.status(200).send(allUsers);
  },
  getUserById: async (req, res) => {
    const {params: {id}} = req;
    let userById;
    console.log(id);
    try {
      userById = await User.findById(id);
      console.log(userById);
    } catch(e) {
      return res.status(402).send(e);
    } 
    res.status(200).send(userById);
  },
  editUserById: async (req, res) => {
    // this is an admin only api
    const { params: { id }, body: { role } } = req; 
   
    let userToUpdate;
 
    try {
      userToUpdate = await User.findById(id);
    } catch(e) {
      console.log(e);
      return res.status(402).send(e);
    }

    try {
      userToUpdate['role'] = role;
      userToUpdate.save();
    } catch(e) {
      return res.status(402).send(e);
      // return res.status(403).send('Forbidden');
    }
 
    res.status(200).send(userToUpdate);
  },
  createUser: async (req, res) => {
    const {username, password} = req.body;
    let newUser;
    
    try {
      let hashPassword = await bcrypt.hash(password, 10);
      newUser = await new User({username, password: hashPassword});
      await newUser.save();
    } catch(e) {
      return res.status(500).send(e);
    }

    res.status(201).json(newUser.serialize());
  }
};