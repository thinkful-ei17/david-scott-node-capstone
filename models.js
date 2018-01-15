'use strict';

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const SongSchema = new mongoose.Schema({
    title: {type: String, required: true},
    lyrics: {type: String, require: true},
    artist: {type: String, default:''},
    notes: {type: String, default:''}
});

const UserSchema = new mongoose.Schema({
    username: {type: String, required: true, unique: true},
    firstName: {type: String},
    lastName: {type: String},
    songs: [{type: mongoose.Schema.Types.ObjectId, ref: 'Song'}]
});

mongoose.connect(DATABASE_URL)
    .then(function(){
        mongoose.connection.db.dropDatabase();

        const songs = Song.create([
            {"title": "title1", "lyrics":"lyrics1", "artist":"artist1", "notes":"none1"},
            {"title": "title2", "lyrics":"lyrics2", "artist":"artist2", "notes":"none2"},
            {"title": "title3", "lyrics":"lyrics3", "artist":"artist3", "notes":"none3"},
            {"title": "title4", "lyrics":"lyrics4", "artist":"artist4", "notes":"none4"}

        ]);

        const users = User.create([
            {username: "joe45", firstName: "joe", lastName:"schmoe"},
            {username: "anne54", firstName: "anne", lastName:"someone"},
            {username: "chris", firstName: "jordan", lastName:"green"}

        ])
    
    return songs
    }).then(songs => {
        console.log(songs);
    })



// const User = mongoose.model('User', userSchema);
// const Song = mongoose.model('Song', songSchema);

exports.User = mongoose.model('User', userSchema);
exports.Song = mongoose.model('Song', songSchema);

