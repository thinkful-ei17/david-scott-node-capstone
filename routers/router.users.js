'use strict';

const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

mongoose.Promise = global.Promise;

const { User, Song } = require('../models');


router.get('/', (req, res) => {
  User
    .find()
    .populate('songs')
    .then(users => {
      console.log('are there songs from the users here?', users);
      res.json(users.map(user => user.serialize()));
    })
    .catch(err => {
      console.error(err);
    });
});

router.get('/:id', (req, res) => {
  User
    .findById(req.params.id)
    .populate('songs')
    .then(user => {
      console.log(user);
      res.json(user.serialize());
    })
    .catch(err => {
      console.error(err);
    });
});

router.post('/', (req, res) => {

  // I want to check if all user.songs is in our songs db
  for (let i = 0; i < req.body.songs.length; i++) {
    const id = req.body.songs[i]._id;
    Song
      .findById(id)
      .then(() => {})
      .catch(err => {
        res.status(400).send('song not in db');
      });
  }

  const requiredFields = ['username'];
  for (let i = 0; i < requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`;
      console.error(message);
      return res.status(400).send(message);
    }
  }

  User
    .create({
      username: req.body.username,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      songs: req.body.songs
    })
    .then(user => 
      res.status(201).json(user.serialize()))
    .catch(err=>console.error(err));
});   

router.put('/:id', (req, res) => {
  if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
    res.status(400).json({
      error: 'Request path id and request body id values must match'
    });
  }
  const fieldsToUpdate = {};
  const updateableFields = ['firstName', 'lastName', 'songs'];
  updateableFields.forEach(field => {
    if (field in req.body) {
      fieldsToUpdate[field] = req.body[field];
    }
  });

  User
    .findByIdAndUpdate(req.params.id, {$set: fieldsToUpdate}, {new: true})
    .then(results => {
      res.status(205).json(results);
    })
    .catch(err => console.error(err));
});

router.delete('/:id', (req, res) => {
  User
    .findByIdAndRemove(req.params.id)
    .then(() => {
      console.log(`Deleted user with id: ${req.params.id}`);
      res.status(204).end();
    });
});





module.exports = router;