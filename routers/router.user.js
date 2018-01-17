'use strict';

const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

mongoose.Promise = global.Promise;

const { User } = require('../models');


router.get('/', (req, res) => {
  User
    .find()
    .populate('songs')
    .then(results => {
      res.json(results);
    })
    .catch(err => {
      console.error(err);
    });
});

router.get('/:id', (req, res) => {
  User
    .findById(req.params.id)
    .populate('songs')
    .then(result => {
      console.log(result);
      res.json(result);
    })
    .catch(err => {
      console.error(err);
    });
});

router.post('/', (req, res) => {
  
  User
    .create({
      username: req.body.username,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      songs: req.body.songs
    })
    .then(user =>
      res.status(201).json(user))
    .catch(err=>console.error(err));
});   

router.put('/:id', (req, res) => {
  
  const fieldsToUpdate = {};

  const updateableFields = ['firstName', 'lastName', 'songs'];
  
  updateableFields.forEach(field => {
    if (field in req.body) {
      fieldsToUpdate[field] = req.body[field];
    }
  });

  User
    .findByIdAndUpdate(`${req.params.id}`, {$set: fieldsToUpdate}, {new: true})
    .then(results => {
      res.status(204).json(results);
    })
    .catch(err => console.error(err));
});

// router.delete()







module.exports = router;