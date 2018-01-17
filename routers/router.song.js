'use strict';

const express = require('express');
const mongoose = require('mongoose');
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
    .then((result) => {
      res.status(205).json(result);
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

router.get('/:id', (req, res) => {
  Song
    .findById(req.params.id)
    .then(result => {
      console.log(result);
      res.json(result);
    })
    .catch(err => {
      console.error(err);
    });
});

router.post('/', (req, res) => {
  Song
    .create({
      title: req.body.title,
      lyrics: req.body.lyrics,
      artist: req.body.artist,
      notes: req.body.notes
    })
    .then(user =>
      res.status(201).json(user))
    .catch(err=>console.error(err));
});  



module.exports = router;