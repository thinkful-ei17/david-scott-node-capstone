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
  if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
    res.status(400).json({
      error: 'Request path id and request body id values must match'
    });
  }

  const fieldsToUpdate = {};
  const updateableFields = ['title', 'lyrics', 'artist', 'notes'];

  updateableFields.forEach(field => {
    if (field in req.body) {
      fieldsToUpdate[field] = req.body[field];
    }
  });

  Song
    .findByIdAndUpdate(req.params.id, {$set: fieldsToUpdate }, { new: true })
    .then(results => {
      res.status(205).json(results);
    })
    .catch(err => console.error(err));

});

router.delete('/:id', (req, res) => {
  Song
    .findByIdAndRemove(req.params.id)
    .then(() => {
      console.log(`Deleted song with id: ${req.params.id}`);
      res.status(204).end();
    });

});



module.exports = router;