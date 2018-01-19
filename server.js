'use strict';

const bodyParser = require('body-parser');
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const routerSong = require('./routers/router.songs');
const routerUser = require('./routers/router.users');

mongoose.Promise = global.Promise;

const { DATABASE_URL, PORT } = require('./config');

const app = express();

app.use(express.static('public'));
app.use(morgan('common'));
app.use(bodyParser.json());
app.use('/songs', routerSong);
app.use('/users', routerUser);

// app.get('/', (req, res) => {
//   res.status(200).json('this is html');
// });

let server;

function runServer(databaseUrl = DATABASE_URL, port = PORT) {
  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, { useMongoClient: true }, err => {
      if (err) {
        return reject(err);
      }
      server = app.listen(port, () => {
        console.log(`Your app is listening on port ${port}`);
        resolve();
      })
        .on('error', err => {
          mongoose.disconnect();
          reject(err);
        });
    });
  });
}
  
// this function closes the server, and returns a promise. we'll
// use it in our integration tests later.
function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log('Closing server');
      server.close(err => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  });
}

if (require.main === module) {
  runServer().catch(err => console.error(err));
}
  
module.exports = { runServer, app, closeServer };
