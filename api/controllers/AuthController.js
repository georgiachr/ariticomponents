/**
 * Created by georgia.chr on 14-Sep-15.
 * Authenticate / Login users
 */

module.exports = {

  authenticate: function(req, res) {

    var email = req.param('email');
    var password = req.param('password');

    if (!email || !password) {
      return res.json(401, {err: 'email and password required'});
    }

    User.findOneByEmail(email, function(err, user) {
      if (!user) {
        return res.json(401, {err: 'invalid email or password'});
      }

      User.validPassword(password, user, function(err, valid) {
        if (err) {
          return res.json(403, {err: 'forbidden'});
        }

        if (!valid) {
          return res.json(401, {err: 'invalid email or password'});
        } else {
          res.json({user: user, token: sailsTokenAuth.issueToken(user.id)});
        }
      });
    })
  }
};
