'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const faker = require('faker');

const should = chai.should();

const { User } = require('../models');
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

function seedUserData() {
  console.info('seeding blog post data');
  const seedData = [];
  for (let i = 1; i <= 5; i++) {
    seedData.push({
      username: faker.internet.userName(),
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      songs: faker.random.words()
    });
  }
  // this will return a promise
  return User.insertMany(seedData);
}


describe('Users endpoints tests', function() {

  before(function () {
    return runServer(TEST_DATABASE_URL);
  });

  beforeEach(function () {
    return tearDownDb()
      .then(() => {
        return seedUserData();
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
      let res;
      return chai.request(app)
        .get('/users')
        .then(_res => {
          res = _res;
          res.should.have.status(200);
          res.body.should.have.length.of.at.least(1);
          return User.count();
        })
        .then(count => {
          res.body.should.have.length.of(count);
        });
    });
  
    it('should return users with right fields', function () {
      let resUser;
      return chai.request(app)
        .get('/users')
        .then(res => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a('array');
          res.body.should.have.length.of.at.least(1);
          res.body.forEach(user => {
            user.should.be.a('object');
            user.should.include.keys('id', 'title', 'lyrics', 'artist', 'notes');
          });
          resUser = res.body[0];
          return User.findById(resUser.id);
        })
        .then(user => {
          resUser.title.should.equal(user.title);
          resUser.content.should.equal(user.content);
          resUser.author.should.equal(user.authorName);
        });
    });
  });
  
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

