'use strict';

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const { Song } = require('../models');



router.get('/', (req, res) => {
  
  Song
    .find()
    .then(results => {
      res.json(results);
    })
    .catch(err => {
      console.error(err);
    });
});

router.put('/:id', (req, res) => {
  const fieldsToUpdate = {};

  const updateableFields = ['title', 'lyrics', 'artist', 'notes'];

  updateableFields.forEach(field => {
    if (field in req.body) {
      fieldsToUpdate[field] = req.body[field];
    }
  });

  Song
    .findByIdAndUpdate(`${req.params.id}`, {$set: fieldsToUpdate }, { new: true })
    .then(results => {
      res.status(204).json(results);
    })
    .catch(err => console.error(err));

});

router.delete('/:id', (req, res) => {

});



module.exports = router;