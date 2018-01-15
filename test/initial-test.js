'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');

const should = chai.should();

const { closeServer, runServer, app } = require('../server');
const { TEST_DATABASE_URL } = require('../config');

chai.use(chaiHttp);

describe('test', function() {

  before(function () {
    return runServer(TEST_DATABASE_URL);
  });

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

