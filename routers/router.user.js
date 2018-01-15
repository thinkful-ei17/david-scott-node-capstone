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









module.exports = router;