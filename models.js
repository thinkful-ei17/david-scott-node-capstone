'use strict';

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
// const {DATABASE_URL} = require('./config');

const SongSchema = mongoose.Schema({
  title: {type: String, required: true},
  lyrics: {type: String, require: true},
  artist: {type: String, default:''},
  notes: {type: String, default:''}
  // singers: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}]
});

const UserSchema = mongoose.Schema({
  username: {type: String, required: true, unique: true},
  firstName: {type: String},
  lastName: {type: String},
  songs: [{type: mongoose.Schema.Types.ObjectId, ref: 'Song'}]
});

UserSchema.virtual('name').get(function () {
  return `${this.firstName} ${this.lastName}`.trim();
});

SongSchema.methods.serialize = function() {
  return {
    id: this.id,
    title: this.title,
    artist: this.artist,
    notes: this.notes,
    lyrics: this.lyrics
  };
};

UserSchema.methods.serialize = function () {
  return {
    id: this._id,
    username: this.username,
    name: this.name,
    songs: this.songs.map(song => {
      return {
        song_id: song._id,
        title: song.title,
        artist: song.artist
      };
    })
  };
};

const User = mongoose.model('User', UserSchema);
const Song = mongoose.model('Song', SongSchema);


module.exports = { User, Song };


// // ======this code is for re-setting our database==================

// mongoose.connect(DATABASE_URL)
//   .then(function(){
//   mongoose.connection.db.dropDatabase();

//   const songs = Song.create([
//     {'title': 'title1', 'lyrics':'lyrics1', 'artist':'artist1', 'notes':'none1'},
//     {'title': 'title2', 'lyrics':'lyrics2', 'artist':'artist2', 'notes':'none2'},
//     {'title': 'title3', 'lyrics':'lyrics3', 'artist':'artist3', 'notes':'none3'},
//     {'title': 'title4', 'lyrics':'lyrics4', 'artist':'artist4', 'notes':'none4'}
//   ]);
//   return songs;
// }).then(songs => {
//   const users = User.create([
//     {username: 'joe45', firstName: 'joe', lastName:'schmoe', songs: [{_id: songs[0]._id}, {_id: songs[1]._id}]},
//     {username: 'anne54', firstName: 'anne', lastName:'someone', songs: [{_id: songs[1]._id}, {_id: songs[2]._id}]},
//     {username: 'chris', firstName: 'jordan', lastName:'green', songs: [{_id: songs[2]._id}, {_id: songs[3]._id}]}
//   ]);
//   return users;
// }).then(users => {
//   return User.find().populate('songs');
// }).then(results => {
// }).catch(err => {
//   console.log(err);
// });




