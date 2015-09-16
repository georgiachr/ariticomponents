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

  var token;

  if (req.headers && req.headers.authorization) {

    var parts = req.headers.authorization.split(' ');
    if (parts.length == 2) {
      var scheme = parts[0],
        credentials = parts[1];

      if (/^Bearer$/i.test(scheme)) {
        token = credentials;
      }
    } else {
      return res.json(401, {err: 'Format is Authorization: Bearer [token]'});
    }
  } else if (req.param('token')) {
    token = req.param('token');
    // We delete the token from param to not mess with blueprints
    delete req.query.token;
  } else {
    return res.json(401, {err: 'No Authorization header was found'});
  }

  sailsTokenAuth.verifyToken(token, function(err, token) {
    if (err) return res.json(401, {err: 'The token is not valid'});

    req.token = token;

    next();
  });

};
