/**
 * Created by georgia.chr on 14-Sep-15.
 *
 * First we check if we have the token on the header which basically is a header called authorization with the content Bearer token_string.
 * If we have this kind of header we store the token_string part. If there is no header, we also check if we have it on the query string like: /api/foo?token=token_string.
 * When we finally have the token, we just verify it, extract its payload and assign it to req.token so we can access it from a controller.
 * If there is no token, we just send an error json.
 */



/**
 *
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
module.exports = function (req, res, next) {

  var header_token;


  if (req.headers) {

    /*
     var parts = req.headers.authorization.split(' ');
     if (parts.length == 2) {
     var scheme = parts[0],
     credentials = parts[1];
     */


    header_token = req.headers["x-auth-token"];

    if (header_token === undefined) {
      console.log("token undefined");
      return res.json(401, {err: 'No Authorization header was found'});
    }


    // check token is valid
    jwtToken.verifyToken(header_token,function(err, token) {
      if (err)
        return res.json(401, {err: 'The token is not valid'});

      decoded = jwtToken.decodeToken(header_token,{complete:true});
      console.log(JSON.stringify(decoded));
      userid = decoded.payload.userid;

      User.findOne({
        id: userid
      },function foundUser(err, user){
        if (err) {console.log("negotiate error");return res.negotiate(err)};
        if (!user) {console.log("not user");return res.notFound();}

        /**
         * check if the token is near expiration
         */
        if ( jwtToken.tokenExpiresInMinutes(header_token) < sails.config.globals.tokenNearTimeExpirationInMinutes){

          newtoken = jwtToken.issueToken(decoded.payload);
          User.update(user.id, {token: newtoken},
            function(err) {
              if (err) return res.negotiate(err);

              // Store user id in the user session
              //req.session.me = user.id;

              // All done- let the client know that everything worked.
              //console.log(JSON.stringify(user));
              //return res.ok();

              // res.json([statusCode, ... ] data);
              res.headers['x-auth-token'] = newtoken;
            });

        }

      });
      next();
    });
  };
};
