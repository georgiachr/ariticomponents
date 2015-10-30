/**
* Car.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  // Define a custom table name
  tableName: 'car',

  // Set schema true/false for adapters that support schemaless
  schema: true,

  attributes: {

    // Car number
    number: {
      type: 'string',
      maxLength: 6,
      minLength: 2,
      required: true
    },

    // The owner
    //links to User model
    owner: {
      type: 'string',
      model: 'user',
      required: true
    }

  }
};

