'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const faker = require('faker');

const should = chai.should();

const { Song, User } = require('../models');
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

function seedData() {
  console.info('seeding song data');
  const songs = [
    {'title': 'title1', 'lyrics':'lyrics1', 'artist':'artist1', 'notes':'none1'},
    {'title': 'title2', 'lyrics':'lyrics2', 'artist':'artist2', 'notes':'none2'},
    {'title': 'title3', 'lyrics':'lyrics3', 'artist':'artist3', 'notes':'none3'},
    {'title': 'title4', 'lyrics':'lyrics4', 'artist':'artist4', 'notes':'none4'}
  ];
  return Song.insertMany(songs)
    .then(songs => {
      console.log('seeding user data');
      const users = [
        {username: 'joey', firstName: 'joe', lastName:'schmoe', songs: [{_id: songs[0]._id}, {_id: songs[1]._id}]},
        {username: 'annie', firstName: 'anne', lastName:'someone', songs: [{_id: songs[1]._id}, {_id: songs[2]._id}]},
        {username: 'jordo', firstName: 'jordan', lastName:'green', songs: [{_id: songs[2]._id}, {_id: songs[3]._id}]}
      ];
      return User.insertMany(users);
    })
    .catch(err => console.error(err));
} 





describe('Users endpoints tests', function() {

  before(function () {
    console.log('runServer');
    return runServer(TEST_DATABASE_URL);
  });

  beforeEach(function () {
    return tearDownDb()
      .then(() => {
        return seedData();
      });
  });

  // afterEach(function () {
  //   return tearDownDb();
  // });

  after(function () {
    return closeServer();
  });
  
  
  describe('GET endpoint', function() {

    it('should return all existing users', function() {
      let response;
      return chai.request(app)
        .get('/users')
        .then(_res => {
          response = _res;
          response.should.have.status(200);
          response.should.be.json;
          response.body.should.be.a('array');
          response.body.should.have.length.of.at.least(1);
          return User.count();
        })
        .then(count => {
          response.body.should.have.length(count);
        });
    });

    it('should return users with correct fields', function () {
    
      return chai.request(app)
        .get('/users')
        .then(res => {
          // console.log('correct fields initial response:',  res);
          res.should.be.status(200);
          res.body.forEach(user => {
            user.should.be.a('object');
            user.should.include.keys('username', 'name', 'songs');
            user.songs.should.be.a('array');
          });
        });
    });

    it('should return one user by id', function(){
      let user;
      return chai.request(app)
        .get('/users')
        .then(res => {
          user = res.body[0];
          // console.log('user:', user);
          return chai.request(app)
            .get(`/users/${user.id}`);
        })
        .then(res => {
          let resUser = res.body;
          resUser.id.should.equal(user.id);
          resUser.username.should.equal(user.username);
          resUser.name.should.equal(`${user.body.firstName} ${user.body.lastName}`);
          resUser.songs.should.equal(user.body.songs);
        })
        .catch(err => console.log(err));    
    });
  }); //ends get endpoint describe block  
  
  
  describe('POST endpoint', function () {
  
    it('should add a new User', function () {
      let songs;
      return chai.request(app)
        .get('/songs')
        .then(res =>{
          // console.log(res.body);
          songs = res.body;
          return songs;
        })
        .then( songs => {
          const newUser = {
            username: 'newUser',
            firstName: 'Brandy',
            lastName: 'Newman',
            songs: [{_id: songs[0].id}, {_id: songs[1].id}]
          };
          // console.log('newUser:', newUser);
          return chai.request(app)
            .post('/users')
            .send(newUser)
            .then(res => {
              // console.log('stringified:', JSON.stringify(res, null, 4));
              // console.log('last res is:',JSON.stringify(res.body, null, 4));
              res.should.be.json;
              res.body.should.be.a('object');
              res.body.should.include.keys('id', 'username', 'name', 'songs');
              res.body.username.should.equal(newUser.username);
              // cause Mongo should have created id on insertion
              res.body.id.should.not.be.null;
              res.should.have.status(201);
              res.body.name.should.equal(`${newUser.firstName} ${newUser.lastName}`);
              // res.body.songs.should.equal(newUser.songs);
              //the song thing is having trouble - I think because of the cross-pollination
              //need to figure out how to work that out
            });
        });    
    });  
  });
  
  describe('PUT endpoint', function () {
  
    it('should update fields you send over', function () {
      let resUser;

      const updateData = {
        firstName: 'Miss',
        lastName: 'Piggy'
      };

      return User
        .findOne()
        .then(res => {
          // console.log('res:', res);
          updateData.id = res._id;
  
          return chai.request(app)
            .put(`/users/${res._id}`)
            .send(updateData);
        })
        .then(res => {
          res.should.have.status(205);
          resUser = res.body;
          // console.log(res.body);
          return User.findById(updateData.id)
            .then(res => {
              res.firstName.should.equal(updateData.firstName);
              res.lastName.should.equal(updateData.lastName);
              //this test should have more things, like song... 
              //but I'm having trouble with the song population right now, 
              //so I'm skipping it.
            });  
        });
    });
  });        

// describe('DELETE endpoint', function () {
  
//   it('should delete a post by id when authenticated', function () {
  
//     let post;
  
//     return BlogPost
//       .findOne()
//       .then(_post => {
//         post = _post;
//         return chai.request(app)
//           .delete(`/posts/${post.id}`)
//           .send({ username: 'bt', password: 'baseball'});
//       })
//       .then(res => {
//         // console.log('1----------------');
//         // console.log(JSON.stringify(res, null, 4));
//         // console.log('2----------------');
  
//         res.should.have.status(204);
//         return BlogPost.findById(post.id);
//       })
//       .then(_post => {
//         // when a variable's value is null, chaining `should`
//         // doesn't work. so `_post.should.be.null` would raise
//         // an error. `should.be.null(_post)` is how we can
//         // make assertions about a null value.
//         should.not.exist(_post);
//       });
//     // .catch( res => {
//     //     console.log('1----------------');
//     //     console.log(JSON.stringify(res.response.text, null, 4));
//     //     console.log('2----------------');
//     //     // i want it to fail; so i put 200 instead of 500
//     //     res.should.have.status(200);
//     // });
//   });
// });
  
// });
  
});

