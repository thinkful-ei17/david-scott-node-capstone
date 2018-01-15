'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');

const should = chai.should();

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

function seedBlogPostData() {
  console.info('seeding blog post data');
  const seedData = [];
  for (let i = 1; i <= 10; i++) {
    seedData.push({
      author: {
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName()
      },
      title: faker.lorem.sentence(),
      content: faker.lorem.text()
    });
  }
  // this will return a promise
  return BlogPost.insertMany(seedData);
}


describe('test', function() {

  before(function () {
    return runServer(TEST_DATABASE_URL);
  });

  // beforeEach(function () {
  //   return seedBlogPostData();
  // });

  // afterEach(function () {
  //   return tearDownDb();
  // });

  after(function () {
    return closeServer();
  });
	
  describe('initial test', function() {
    it('should return 200 status and html', function() {
      return chai.request(app)
        .get('/')
        .then(res=> {
          res.should.have.status(200);
          res.should.be.html;
        });
    });
  });
});

