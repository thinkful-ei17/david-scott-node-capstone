'use strict';

const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

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