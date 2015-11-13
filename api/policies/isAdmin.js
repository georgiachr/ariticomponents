/**
 * Created by georgia.chr on 21-Sep-15.
 */

//TODO: change title to role
module.exports = function (req, res, next) {

  var userRole = (req.param('requestedUserRole'));

  if ( userRole != 'Administrator')
  {
    console.log("isAdmin policy: negotiate error");

    return res.forbidden();
  };

  next();

};
