'use strict';

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const SongSchema = new mongoose.Schema({
    title: {type: String, required: true},
    lyrics: {type: String, require: true},
    artist: {type: String},
    notes: {type: String}
});


const UserSchema = new mongoose.Schema({
    username: {type: String, required: true, unique: true},
    firstName: {type: String},
    lastName: {type: String},
    songs: [{type: mongoose.Schema.Types.ObjectId, ref: 'Song'}]
});


// const User = mongoose.model('User', userSchema);
// const Song = mongoose.model('Song', songSchema);

exports.User = mongoose.model('User', userSchema);
exports.Song = mongoose.model('Song', songSchema);

