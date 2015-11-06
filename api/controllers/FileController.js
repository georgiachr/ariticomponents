/**
 * FileController
 *
 * @description :: Server-side logic for managing Files
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */


/**
 * Utility functions
 */

function getFileExtension(fileName) {
  return fileName.split('.').slice(-1);
}

var sid = require('shortid');


module.exports = {

  /**
   * Policies: isAdmin
   * Upload file somewhere
   * @param req : {file: file, filename: file.name, id: userid, requestedUserRole: $scope.useridentity.userRole}
   * @param res
   */
  uploadAvatar: function(req, res) {

    console.log("uploadAvatar");
    sails.log.warn("uploadAvatar");
    sails.log.info("uploadAvatar");


    /***** D E C L A R A T I O N *****/
    var realFileName = null;
    var fileOwnersId = null;
    var fileToUpload = null;
    var newfilename = null;
    var fileextension = null;

    /***** I N I T I A L I Z A T I O N *****/

    // prepare the new file (generate new name, find type)
    try{
        fileToUpload = req.file('file');
        realFileName = req.body['filename'];
        fileOwnersId = req.body['id'];

    }catch(err) {
      var errorString = "Cannot get file and other request parameters: ";
      console.log(errorString + JSON.stringify(err));
      return res.send(400, err);
    }

    //|| (realFileName || fileOwnersId === null)
    if ((realFileName  === undefined) || (fileOwnersId  === undefined))
    {
      var errorString = "Something is undefined or null: ";
      console.log(errorString );
      console.log('realFileName = '+ realFileName);
      console.log('fileOwnersId = '+ fileOwnersId);

      return res.send(402, "Something is undefined or null");
    }
    else
    {
      //console.log('fileToUpload = '+ JSON.stringify(fileToUpload));
      //JSON.stringify(obj, null, 4);


      //prepare name
      try
      {
        sid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@');
        sid.seed(61);

        newfilename = sid.generate();

        var filetype = getFileExtension(realFileName);

        fileextension = ".".concat(filetype);

        newfilename = newfilename.concat(fileextension);
      }
      catch(exc)
      {
        var errorString = "Something went wrong during name preparing: ";
        console.log(errorString + JSON.stringify(exc));
        return res.send(402, "Something went wrong during name preparing");
      }
    }

    console.log('Go to processing');

    /***** V A L I D A T I O N S *****/
    //TODO : validations
    /*
    try{
      req.validate({
        name: 'string',
        id: 'string'
      });
    }catch(err){
      console.log(JSON.stringify(err));
      return res.send(400, err);
    }
  */

    /***** P R O C E S S I N G *****/

    // 1. Save the file in the directory specified in globals.js

    fileToUpload.upload(
    {
      // see https://github.com/balderdashy/skipper for all the available attributes
      saveAs: newfilename,
      maxBytes: 10000000 // don't allow the total upload size to exceed ~10MB
      //dirname: require('path').resolve(sails.config.appPath,sails.config.globals.dataPath)
    }
    ,function uploadAvatarFile (err, uploadedFile) {

      if (err) {
        return res.negotiate(err);
      }

      sails.log.warn(uploadedFile.length);

      // If no files were uploaded, respond with an error.
      if (uploadedFile.length === 0){
        console.log('No file was uploaded');
        return res.badRequest('No file was uploaded');
      }
      else
      {
        sails.log.info("Create the new File in the DB");
        //2. Create the new File in the DB
        File.create(
        {
          name: newfilename,
          type: filetype,
          userid: fileOwnersId //one to one association here
        })
          .exec({

            error: function FileCreateError (err) {
              return res.negotiate(err);
            },

            success: function FileCreateSuccess (newFile) {

              sails.log.info("Update user with the current file");
              sails.log.info("newfiel = " + newFile.id);

              // 3. Update user with the current file
              User.update(
                {id: fileOwnersId}, //what to look for
                {avatar: newFile.id} //what to update - it's the file's id (one to one association here)
              )
                .exec({

                  error: function updateUserError (err) {
                    return res.negotiate(err);
                  },

                  success: function updateUserSuccess (userFound) {
                    //return res.ok();

                    return res.json(200);

                    // Send back
                    /*
                    return res.json(200,{
                      id: newUser.id
                    });
                     */
                    }

                }); // User.find.exec
            } //function FileCreateSuccess
          }); //  File.create.exec

      } // else (uploadedFiles.length != 0)

    } // uploadFileDone
  ); // requestFile.upload(

  },

  /**
   * Download the file
   * @param req
   * @param res
   */
  downloadFile: function(req, res) {

    req.validate({
      id: 'string'
    });

    User.findOne(req.param('id')).exec(function (err, user){
      if (err) return res.negotiate(err);
      if (!user) return res.notFound();

      // User has no avatar image uploaded.
      // (should have never have hit this endpoint and used the default image)
      if (!user.avatarFd) {
        return res.notFound();
      }

      var SkipperDisk = require('skipper-disk');
      var fileAdapter = SkipperDisk(/* optional opts */);

      // Stream the file down
      fileAdapter.read(user.avatarFd)
        .on('error', function (err){
          return res.serverError(err);
        })
        .pipe(res);
    });


  }


};

