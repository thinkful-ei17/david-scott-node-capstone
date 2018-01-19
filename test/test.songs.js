'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const faker = require('faker');

const should = chai.should();

const { Song } = require('../models');
const { closeServer, runServer, app } = require('../server');
const { TEST_DATABASE_URL } = require('../config');

chai.use(chaiHttp);

function tearDownDb() {
  return new Promise((resolve, reject) => {
    console.warn('Deleting database');
    mongoose.connection.dropDatabase()
      .then(result => resolve(result))
      .catch(err => reject(err));
  });
}

function seedSongData() {
  console.info('seeding song data');
  const seedData = [];
  for (let i = 1; i <= 5; i++) {
    seedData.push({
      title: faker.name.title(),
      lyrics: faker.lorem.sentence(),
      artist: faker.name.firstName(),
      notes: faker.lorem.words()
    });
    return Song.insertMany(seedData);
  }
}

describe('Songs endpoints tests', function() {

  before(function () {
    return runServer(TEST_DATABASE_URL);
  });

  beforeEach(function () {
    return tearDownDb()
      .then(() => {
        return seedSongData();
      });
  });

  // afterEach(function () {
  //   return tearDownDb();
  // });

  after(function () {
    return closeServer();
  });
  
  
  describe('GET endpoint', function() {
    it('should return all existing songs', function() {
      let res;
      return chai.request(app)
        .get('/songs')
        .then(_res => {
          res = _res;
          res.should.have.status(200);
          res.body.should.have.length.of.at.least(1);
          return Song.count();
        })
        .then(count => {
          res.body.should.have.length.of(count);
        });
    });
  
    it('should return songs with right fields', function () {
      let resSong;
      return chai.request(app)
        .get('/songs')
        .then(res => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a('array');
          res.body.should.have.length.of.at.least(1);
          res.body.forEach(song => {
            song.should.be.a('object');
            song.should.include.keys('title', 'lyrics', 'artist', 'notes');
          });
          resSong = res.body[0];
          return Song.findById(resSong.id);
        })
        .then(song => {
          resSong.title.should.equal(song.title);
          resSong.lyrics.should.equal(song.lyrics);
          resSong.artist.should.equal(song.artist);
          resSong.notes.should.equal(song.notes);
        });
    });
  });


  describe('POST endpoint', function () {
    it('should add a new song', function () {
      const newSong = {
        title: faker.name.title(),
        lyrics: faker.lorem.sentence(),
        artist: faker.name.firstName(),
        notes: faker.lorem.words()
      };
  
      return chai.request(app)
        .post('/songs')
        .send(newSong)
        .then(res => {
          res.should.have.status(201);
          res.should.be.json;
          res.body.should.be.a('object');
          res.body.should.include.keys('title', 'lyrics', 'artist', 'notes');
          res.body.title.should.equal(newSong.title);
          res.body.id.should.not.be.null;
          res.body.lyrics.should.equal(newSong.lyrics);
          return Song.findById(res.body.id);
        })
        .then(song => {
          song.title.should.equal(newSong.title);
          song.lyrics.should.equal(newSong.lyrics);
          song.artist.should.equal(newSong.artist);
          song.notes.should.equal(newSong.notes);
        });
    });
  });

  describe('PUT endpoint', function () {
    it('should update songs', function () {
      const updateData = {
        title: 'updated title',
        lyrics: 'updated lyrics',
        artist: 'updated artist',
        notes: 'updated notes'
      };
  
      return Song
        .findOne()
        .then(song => {
          updateData.id = song.id;
  
          return chai.request(app)
            .put(`/songs/${song.id}`)
            .send(updateData);
        })
        .then(res => {
          res.should.have.status(205);
          return Song.findById(updateData.id);
        })
        .then(song => {
          song.title.should.equal(updateData.title);
          song.lyrics.should.equal(updateData.lyrics);
          song.artist.should.equal(updateData.artist);
          song.notes.should.equal(updateData.notes);
        });
    });
  });

  describe('DELETE endpoint', function () {
    it('should delete a song', function () {
      let song;
  
      return Song
        .findOne()
        .then(_song => {
          song = _song;
          return chai.request(app)
            .delete(`/songs/${song.id}`);
        })
        .then(res => {
          res.should.have.status(204);
          return Song.findById(song.id);
        })
        .then(_song => {
          should.not.exist(_song);
        });
    });
  });
});