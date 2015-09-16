/**
 * Created by georgia.chr on 14-Sep-15.
 *  This service handles the encode / decode (this JWT implementation calls those methods sign and verify respectively)
 */


var
  jwt = require('jsonwebtoken');
  tokenSecret = "secretissecet";

/*
* Creates a token
* Use sails config to set TIME, TIME TO LEAVE, NEAR TIME TO EXPIRE
* */
module.exports.issueToken = function(payload) {
  var token = jwt.sign(payload, process.env.TOKEN_SECRET || tokenSecret);

  return token;
};

/*
TODO: Use NEAR TIME TO EXPIRE to re-issue the token
 */
module.exports.verifyToken = function(token, verified) {

  return jwt.verify(
    token, // The token to be verified
    process.env.TOKEN_SECRET || tokenSecret, // Same token we used to sign
    {}, // No Option, for more see https://github.com/auth0/node-jsonwebtoken#jwtverifytoken-secretorpublickey-options-callback
    callback //Pass errors or decoded token to callback
  );

};
