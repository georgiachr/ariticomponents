/**
 * Created by nstyladmin on 30/10/2015.
 */
/**
 * Created by nstyladmin on 30/10/2015.
 */
var Sails = require('sails'),
sails;

var chai = require('chai');
var expect = chai.expect;
var should = chai.should;
var assert = chai.assert;


before(function(done) {

  // Increase the Mocha timeout so that Sails has enough time to lift.
  this.timeout(10000);

  Sails.lift({
    log: {
      level: 'error'
    },
    models: {
      connection: 'someMongodbServer'
    }
    // configuration for testing purposes
  }, function(err, server) {
    sails = server;
    if (err)
      return done(err);

    // here you can load fixtures, etc.
    done(err, sails);
  });
});

after(function(done) {
  // here you can clear fixtures, etc.
  Sails.lower(done);
});
