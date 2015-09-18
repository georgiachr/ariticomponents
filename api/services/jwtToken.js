/**
 * Created by georgia.chr on 14-Sep-15.
 *  This service handles the encode / decode (this JWT implementation calls those methods sign and verify respectively)
 */


var
  jwt = require('jsonwebtoken');


/*
* Creates a token
* Use sails config to set TIME, TIME TO LEAVE, NEAR TIME TO EXPIRE
* */
module.exports.issueToken = function(payload) {

  var expiration = new Date(
    (new Date()).getTime() + (sails.config.globals.tokenExpirationInMinutes * 60 * 1000 )
  );

  /**
   * amend payload with expiration date
   * @type {Date}
   */
  payload.expiration = expiration;

  var token =
      jwt.sign(
        payload,
        process.env.TOKEN_SECRET || sails.config.globals.tokensalt,
        {
          expirationInMinutes: sails.config.globals.tokenExpirationInMinutes
        }
      );



  return token;
};

/*
TODO: Use NEAR TIME TO EXPIRE to re-issue the token
 */
module.exports.verifyToken = function(token,callback) {

  return jwt.verify(
    token, // The token to be verified
    process.env.TOKEN_SECRET || sails.config.globals.tokensalt, // Same token we used to sign
    {}
    , // No Option, for more see https://github.com/auth0/node-jsonwebtoken#jwtverifytoken-secretorpublickey-options-callback
    callback //Pass errors or decoded token to callback
  );
};

/**
 *
 */
module.exports.decodeToken = function(token,options) {

  return jwt.decode(
    token, // The token to be verified
    options
  );

};

/**
 * If returns a negative value then the token is invalid
 * else
 * return value is the number of minutes until expiration
 */
module.exports.tokenExpiresInMinutes = function(token) {

  decoded = jwt.decode(
    token, // The token to be verified
    {complete: true}
  );

  var token_exp = new Date(decoded.payload.expiration);
  var now = new Date().getTime();

  return (token_exp - now)/1000/60;
};
