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
      let resUser;
      return chai.request(app)
        .get('/users')
        .then(res => {
          console.log('correct fields initial response:',  res);
          res.should.be.status(200);
          res.body.forEach(user => {
            user.should.be.a('object');
            user.should.include.keys('username', 'name', 'songs');
          });
        });
    });
  });           
  //         resUser = res.body[0];
  //         console.log('resUser.id:', resUser.id);
  //         return chai.request(app)
  //           .get(`/users/${res.User.id}`)
  //       })
  //       .then(user => {
  //         console.log('user from findBy id:', user.body);
  //         resUser.username.should.equal(user.body.username);
  //         resUser.name.should.equal(`${user.body.firstName} ${user.body.lastName}`);
  //         resUser.songs.should.equal(user.body.songs);
  //       });
  //   });
  // });
  
// describe('POST endpoint', function () {
  
//   it('should add a new blog post when authenticated', function () {
//     const newPost = {
//       username: 'bt',
//       password: 'baseball',
//       title: faker.lorem.sentence(),
//       author: {
//         firstName: faker.name.firstName(),
//         lastName: faker.name.lastName(),
//       },
//       content: faker.lorem.text()
//     };
  
//     return chai.request(app)
//       .post('/users')
//     // .auth('username', 'password')
//       .send(newPost)
//       .then(function (res) {
//         res.should.have.status(201);
//         res.should.be.json;
//         res.body.should.be.a('object');
//         res.body.should.include.keys(
//           'id', 'title', 'content', 'author', 'created');
//         res.body.title.should.equal(newPost.title);
//         // cause Mongo should have created id on insertion
//         res.body.id.should.not.be.null;
//         res.body.author.should.equal(
//           `${newPost.author.firstName} ${newPost.author.lastName}`);
//         res.body.content.should.equal(newPost.content);
//         return BlogPost.findById(res.body.id);
//       })
//       .then(function (post) {
//         post.title.should.equal(newPost.title);
//         post.content.should.equal(newPost.content);
//         post.author.firstName.should.equal(newPost.author.firstName);
//         post.author.lastName.should.equal(newPost.author.lastName);
//       });
//   });
// });
  
// describe('PUT endpoint', function () {
  
//   it('should update fields you send over when authenticated', function () {
//     const updateData = {
//       username: 'bt',
//       password: 'baseball',
//       title: 'cats cats cats',
//       content: 'dogs dogs dogs',
//       author: {
//         firstName: 'foo',
//         lastName: 'bar'
//       }
//     };
  
//     return BlogPost
//       .findOne()
//       .then(post => {
//         updateData.id = post.id;
  
//         return chai.request(app)
//           .put(`/users/${post.id}`)
//           .send(updateData);
//       })
//       .then(res => {
//         res.should.have.status(204);
//         return BlogPost.findById(updateData.id);
//       })
//       .then(post => {
//         post.title.should.equal(updateData.title);
//         post.content.should.equal(updateData.content);
//         post.author.firstName.should.equal(updateData.author.firstName);
//         post.author.lastName.should.equal(updateData.author.lastName);
//       });
//   });
// });
  
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

