/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#!/documentation/reference/sails.config/sails.config.bootstrap.html
 */

var package = require("../package.json");

module.exports.bootstrap = function(cb) {

  // It's very important to trigger this callback method when you are finished
  // with the bootstrap!  (otherwise your server will never lift, since it's waiting on the bootstrap)
    sails.config.version = package.version;
    console.log(sails.config.version + " this is a version");

/*
    User.findOrCreate(
      // Search for user with "admin" flag
      {admin: true},
      // Create one if no such user is found
      {admin: true, name: 'Admin User',}
  ).exec(cb);
  */

    cb();
};
