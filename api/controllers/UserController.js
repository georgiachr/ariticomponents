/**
 * UserController
 *
 * @description :: Server-side logic for managing Users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 *
 */

module.exports = {

  /* User S I G N U P */
  /*signup: function (req, res) {

    // Do some validation on the input
    if (req.body.password !== req.body.confirmPassword) {
      return res.json(401, {err: 'Password doesn\'t match'});
    }

    User.create({admin: req.body.admin, fullname: req.body.name, email: req.body.email, encryptedPassword: req.body.password})
      .exec(function(err, user) {
        if (err) {
          res.json(err.status, {err: err});
          return;
        }
        if (user) {
          res.json({user: user, token: sailsTokenAuth.issueToken(user.id)});
        }
    });
  },*/


  /* User L O G I N */
  /* This is actually the user AUTHENTICATION process*/
  /*login: function (req, res) {

    var email = req.param('email');
    var password = req.param('password');

    if (!email || !password) {
      return res.json(401, {err: 'Email and Password required'});
    }

    User.findOneByEmail(email, function(err, user) {

      if (!user) {
        return res.json(401, {err: 'Invalid Email or Password'});
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

  }*/

  ////////////////////////////////////////////////////////////////////////////////

  /**
   * Normally if unspecified, pointing a route at this action will cause Sails
   * to use its built-in blueprint action.  We're overriding that here to pass
   * down additional information.
   */
  destroy: function (req, res) {

    if (!req.param('id')){
      return res.badRequest('id is a required parameter.');
    }

    User.destroy({
      id: req.param('id')
    }).exec(function (err, usersDestroyed){
      if (err) return res.negotiate(err);
      if (usersDestroyed.length === 0) {
        return res.notFound();
      }

      // Let everyone who's subscribed know that this user is deleted.
      User.publishDestroy(req.param('id'), undefined, {
        previous: {
          name: usersDestroyed[0].name
        }
      });

      // Unsubscribe all the sockets (e.g. browser tabs) who are currently
      // subscribed to this particular user.
      _.each(User.subscribers(usersDestroyed[0]), function(socket) {
        User.unsubscribe(socket, usersDestroyed[0]);
      });

      return res.ok();
    });
  },



  /**
   * Normally if unspecified, pointing a route at this action will cause Sails
   * to use its built-in blueprint action.  We're overriding that here to strip some
   * properties from the user before sending it down in the response.
   */
  findOne: function (req, res) {

    if (!req.param('id')){
      return res.badRequest('id is a required parameter.');
    }

    User.findOne(req.param('id')).exec(function (err, user) {
      if (err) return res.negotiate(err);
      if (!user) return res.notFound();

      // "Subscribe" the socket.io socket (i.e. browser tab)
      // to each User record to hear about subsequent `publishUpdate`'s
      // and `publishDestroy`'s.
      if (req.isSocket) {
        User.subscribe(req, user.id);
      }


      // Only send down white-listed attributes
      // (e.g. strip out encryptedPassword)
      return res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        title: user.title,
        gravatarUrl: user.gravatarUrl,
        admin: user.admin,
        lastLoggedIn: user.lastLoggedIn,

        // Add a property called "msUntilInactive" so the front-end code knows
        // how long to display this particular user as active.
        msUntilInactive: (function (){
          var _msUntilLastActive;
          var now = new Date();
          _msUntilLastActive = (user.lastActive.getTime()+15*1000) - now.getTime();
          if (_msUntilLastActive < 0) {
            _msUntilLastActive = 0;
          }
          return _msUntilLastActive;
        })()
      }); //</res.json>

    }); //</User.findOne()>
  },




  /**
   * Normally if unspecified, pointing a route at this action will cause Sails
   * to use its built-in blueprint action.  We're overriding that here to strip some
   * properties from the objects in the array of users (e.g. the encryptedPassword)
   */
  find: function (req, res) {

    // "Watch" the User model to hear about `publishCreate`'s.
    User.watch(req);

    User.find().exec(function (err, users) {
      if (err) return res.negotiate(err);

      var prunedUsers = [];

      // Loop through each user...
      _.each(users, function (user){

        // "Subscribe" the socket.io socket (i.e. browser tab)
        // to each User record to hear about subsequent `publishUpdate`'s
        // and `publishDestroy`'s.
        if (req.isSocket){
          User.subscribe(req, user.id);
        }

        // Only send down white-listed attributes
        // (e.g. strip out encryptedPassword from each user)
        prunedUsers.push({
          id: user.id,
          name: user.name,
          email: user.email,
          title: user.title,
          gravatarUrl: user.gravatarUrl,
          admin: user.admin,
          lastLoggedIn: user.lastLoggedIn,

          // Add a property called "msUntilInactive" so the front-end code knows
          // how long to display this particular user as active.
          msUntilInactive: (function (){
            var _msUntilLastActive;
            var now = new Date();
            _msUntilLastActive = (user.lastActive.getTime()+15*1000) - now.getTime();
            if (_msUntilLastActive < 0) {
              _msUntilLastActive = 0;
            }
            return _msUntilLastActive;
          })()
        });
      });

      // Finally, send array of users in the response
      return res.json(prunedUsers);
    });
  },





  /**
   * This action is the first endpoint hit by logged-in sockets after they connect.
   * This is implemented by our web front-end in:
   * `assets/js/activity-overlord/ui-controls/DashboardCtrl.js`
   */
  comeOnline: function (req, res) {

    // Look up the currently-logged-in user
    User.findOne(req.session.me).exec(function (err, user) {
      if (err) return res.negotiate(err);
      if (!user) {
        return res.notFound('User associated with socket "coming online" no longer exists.');
      }

      // 15s timeout until inactive
      var INACTIVITY_TIMEOUT = 15*1000;

      // Update the `lastActive` timestamp for the user to be the server's local time.
      User.update(user.id, {
        lastActive: new Date()
      }).exec(function (err){
        if (err) return res.negotiate(err);

        // Tell anyone who is allowed to hear about it
        User.publishUpdate(req.session.me, {
          justBecameActive: true,
          msUntilInactive: INACTIVITY_TIMEOUT,
          name: user.name
        });

        return res.ok();
      });
    });
  },






  /**
   * Update your own profile
   * ("you" being the currently-logged in user, aka `req.session.me`)
   */
  updateMyProfile: function (req, res) {

    (function _prepareAttributeValuesToSet(allParams, cb){
      var setAttrVals = {};

      if (allParams.name) {
        setAttrVals.name = allParams.name;
      }
      if (allParams.title) {
        setAttrVals.title = allParams.title;
      }
      if (allParams.email) {
        setAttrVals.email = allParams.email;
        // If email address changed, also update gravatar url
        // execSync() is only available for synchronous machines.
        // It will return the value sent out of the machine's defaultExit and throw otherwise.
        setAttrVals.gravatarUrl = require('machinepack-gravatar').getImageUrl({
          emailAddress: allParams.email
        }).execSync();
      }

      // Encrypt password if necessary
      if (!allParams.password) {
        return cb(null, setAttrVals);
      }
      require('machinepack-passwords').encryptPassword({password: allParams.password}).exec({
        error: function (err){
          return cb(err);
        },
        success: function (encryptedPassword){
          setAttrVals.encryptedPassword = encryptedPassword;
          return cb(null, setAttrVals);
        }
      });
    })(req.allParams(), function (err, attributeValsToSet){
      if (err) return res.negotiate(err);

      User.update(req.session.me, attributeValsToSet).exec(function (err){
        if (err) return res.negotiate(err);

        // Let all connected sockets who were allowed to subscribe to this user
        // record know that there has been a change.
        User.publishUpdate(req.session.me, {
          name: attributeValsToSet.name,
          email: attributeValsToSet.email,
          title: attributeValsToSet.title,
          gravatarUrl: attributeValsToSet.gravatarUrl
        });

        // Respond with user's data so that UI can be updated.
        return res.ok({
          name: attributeValsToSet.name,
          email: attributeValsToSet.email,
          title: attributeValsToSet.title,
          gravatarUrl: attributeValsToSet.gravatarUrl
        });
      });
    });
  },




  /**
   * Update any user.
   */
  update: function (req, res) {

    if (!req.param('id')) {
      return res.badRequest('`id` of user to edit is required');
    }

    (function _prepareAttributeValuesToSet(allParams, cb){

      var setAttrVals = {};
      if (allParams.name) {
        setAttrVals.name = allParams.name;
      }
      if (allParams.title) {
        setAttrVals.title = allParams.title;
      }
      if (allParams.email) {
        setAttrVals.email = allParams.email;
        // If email address changed, also update gravatar url
        // execSync() is only available for synchronous machines.
        // It will return the value sent out of the machine's defaultExit and throw otherwise.
        setAttrVals.gravatarUrl = require('machinepack-gravatar').getImageUrl({
          emailAddress: allParams.email
        }).execSync();
      }

      // In this case, we use _.isUndefined (which is pretty much just `typeof X==='undefined'`)
      // because the parameter could be sent as `false`, which we **do** care about.
      if ( !_.isUndefined(allParams.admin) ) {
        setAttrVals.admin = allParams.admin;
      }

      // Encrypt password if necessary
      if (!allParams.password) {
        return cb(null, setAttrVals);
      }
      require('machinepack-passwords').encryptPassword({password: allParams.password}).exec({
        error: function (err){
          return cb(err);
        },
        success: function (encryptedPassword) {
          setAttrVals.encryptedPassword = encryptedPassword;
          return cb(null, setAttrVals);
        }
      });
    })(req.allParams(), function afterwards (err, attributeValsToSet){
      if (err) return res.negotiate(err);

      User.update(req.param('id'), attributeValsToSet).exec(function (err){
        if (err) return res.negotiate(err);

        // Let all connected sockets who were allowed to subscribe to this user
        // record know that there has been a change.
        User.publishUpdate(req.param('id'), {
          name: attributeValsToSet.name,
          email: attributeValsToSet.email,
          title: attributeValsToSet.title,
          admin: attributeValsToSet.admin,
          gravatarUrl: attributeValsToSet.gravatarUrl
        });

        return res.ok();
      });
    });

  },



  /**
   * Check the provided email address and password, and if they
   * match a real user in the database, sign in to Activity Overlord.
   */
  login: function (req, res) {

    req.validate({
      email: 'string',
      password: 'string'
    });

    // Try to look up user using the provided email address
    User.findOne({
      email: req.param('email')
    }, function foundUser(err, user) {
      if (err) {console.log("negotiate error");return res.negotiate(err)};
      if (!user) {console.log("not user");return res.notFound();}



      //console.log(new Date());

      /*
       Compare password attempt from the form params to the encrypted password
       from the database (`user.password`)

       Passwords.checkPassword({
         passwordAttempt: 'l0lcatzz',
         encryptedPassword: 'as34hafsu#w34ndcarok',
       })
       */
      require('machinepack-passwords').checkPassword({passwordAttempt: req.param('password') , encryptedPassword: user.encryptedPassword})
        .exec({

          error: function (err){
            return res.negotiate(err);
          },

          // If the password from the form params doesn't checkout w/ the encrypted
          // password from the database...
          incorrect: function (){
            return res.notFound();
          },

          success: function (){
            //console.log(JSON.stringify(user));
            // The user is "logging in" (e.g. establishing a session)
            // so update the `lastLoggedIn` attribute.
            User.update(user.id, {lastLoggedIn: (new Date()).toString()},
              function(err) {
                if (err) return res.negotiate(err);

              // Store user id in the user session
              //req.session.me = user.id;

              // All done- let the client know that everything worked.
              //return res.ok();
            });

            User.update(user.id, {token: jwtToken.issueToken({userid: user.id})},
              function(err) {
                if (err) return res.negotiate(err);

                // Store user id in the user session
                //req.session.me = user.id;

                // All done- let the client know that everything worked.
                //console.log(JSON.stringify(user));
                //return res.ok();

                // res.json([statusCode, ... ] data);
                res.json(200, {user: user, token: user.token});
              });
          }
      });
    });
  },




  /**
   * Log out of Activity Overlord.
   * (wipes `me` from the sesion)
   */
  logout: function (req, res) {

    var header_token = null;


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


          User.update(user.id, {token: ""},
            function(err) {
              if (err) return res.negotiate(err);

              // Store user id in the user session
              //req.session.me = user.id;

              // All done- let the client know that everything worked.
              //console.log(JSON.stringify(user));
              //return res.ok();

              // res.json([statusCode, ... ] data);
              res.json(200);
            });
        });
      });
    };
  },




  /**
   * Sign up for a user account.
   * (creates a new user, and also logs in as that new user)
   */
  signup: function(req, res) {



    // Encrypt the password provided by the user
    require('machinepack-passwords').encryptPassword({password: req.param('password')})
      .exec({

        error: function(err) {
          return res.negotiate(err);
        },

        success: function(encryptedPassword) {
         require('machinepack-gravatar').getImageUrl({emailAddress: req.param('email')})
          .exec({

              error: function(err) {
                return res.negotiate(err);
              },

              success: function(gravatarUrl) {

                // Create a User with the params sent from
                // the sign-up form --> new.ejs
                User.create({
                  name: req.param('name'),
                  title: req.param('title'),
                  email: req.param('email'),
                  encryptedPassword: encryptedPassword,
                  lastLoggedIn: new Date(),
                  gravatarUrl: gravatarUrl
                }, function userCreated(err, newUser) {
                  if (err) {

                    // If this is a uniqueness error about the email attribute,
                    // send back an easily parseable status code.
                    if (err.invalidAttributes && err.invalidAttributes.email && err.invalidAttributes.email[0] && err.invalidAttributes.email[0].rule === 'unique') {
                      return res.emailAddressInUse();
                    }

                    // Otherwise, send back something reasonable as our error response.
                    return res.negotiate(err);
                  }

                  // Log user in
                  req.session.me = newUser.id;

                  // Let other subscribed sockets know that the user was created.
                  User.publishCreate({
                    id: newUser.id,
                    name: newUser.name,
                    title: newUser.title,
                    email: newUser.email,
                    lastLoggedIn: newUser.lastLoggedIn
                  });

                  // Send back the id of the new user
                  return res.json({
                    id: newUser.id
                  });
                });
            }

        });
      }
    });
  }



};
