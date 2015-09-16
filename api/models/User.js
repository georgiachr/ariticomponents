/**
* User.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/


// We don't want to store password with out encryption
var bcrypt = require('bcrypt');


module.exports = {
  // Define a custom table name
  tableName: 'user',

  // Set schema true/false for adapters that support schemaless
  schema: true,

  // Define an adapter to use
  //adapter: 'postgresql',

  /* A T T R I B U T E S */
  attributes: {

    // The user's fullname
    name: {
      type: 'string',
      required: true
    },

    // The user's email address
    // e.g. nikola@tesla.com
    email: {
      type: 'email',
      required: true,
      unique: true
    },

    // The user's title at their job (or something)
    // e.g. Nurse, Admin, Doctor
    title: {
      type: 'string'
    },

    // The encrypted password for the user MD5
    // e.g. asdgh8a249321e9dhgaslcbqn2913051#T(@GHASDGA
    encryptedPassword: {
      type: 'string'
    },

    lastActive: {
      type: 'date',
      required: true,
      defaultsTo: new Date(0)
    },

    // The timestamp when the the user last logged in
    // (i.e. sent a username and password to the server)
    lastLoggedIn: {
      type: 'date',
      required: true,
      defaultsTo: new Date(0)
    },

    // Whether or not the user has administrator privileges
    admin: {
      type: 'boolean',
      defaultsTo: false
    },

    /**
     * user role options:
     * 1. Admin : system administrator
     * 2. Coordinator : Nurse with more privileges
     * 3. Nurse :
     * 4. login-user
     */
    role: {
      type: 'string',
      defaultsTo: 'login-user'
    },

    // url for gravatar
    gravatarUrl: {
      type: 'string'
    },

    // token
    token: {
      type: 'string'
    }


  },

  /* M E T H O D S */

  // We don't want to send back encrypted password either
  toJSON: function () {
    var obj = this.toObject();
    delete obj.encryptedPassword;
    return obj;
  },

  comparePassword: function (password, user, cb) {
    bcrypt.compare(password, user.encryptedPassword, function (err, match) {

      if (err) cb(err);
      if (match) {
        cb(null, true);
      } else {
        cb(err);
      }
    })
  }

};

