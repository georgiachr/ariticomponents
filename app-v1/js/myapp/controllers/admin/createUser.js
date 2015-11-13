/**
 * Created by georgia.chr on 21-Sep-15.
 */

myApp
  .controller('CreateUserCtrl', ['$rootScope', '$scope', '$http', '$modal', 'toastr', 'Upload','useridentity', function($rootScope, $scope, $http, $modal, toastr, Upload, useridentity){

    /* ================================= DEBUGGING ================================= */

    console.log("Controller CreateUsersCtrl called!");


    /* ================================= DECLARATIONS ================================= */

    /**
     * useridentity instance - use as public
     */
    $scope.useridentity = useridentity;


    $scope.userRolesOptions = ['Nurse', 'Doctor', 'Coordinator', 'Super Admin', 'Admin'];

    // set-up loading state
    $scope.addUserForm = {
      loading: false
    };


    // just for testing - not working
    $scope.addUserForm.title = $scope.userRolesOptions[0];

    /* ================================= FUNCTIONS ================================= */

    $scope.changeUserRole = function(){

    };

    $scope.resetForm = function(){

      $scope.addUserForm.loading = false;
      $scope.addUserForm.name = "";
      $scope.addUserForm.email = "";
      $scope.addUserForm.password = "";
      $scope.addUserForm.surname = "";
      $scope.addUserForm.avatar = "";
      $scope.addUserForm.cars = "";

    };

    $scope.resetForm();

    $scope.printUserRole = function() {
      return $scope.addUserForm.title;
    };



    /**
     * submitAddUserForm()
     * http request to SAILS
     */
    $scope.submitAddUserForm = function(){

      // Set the loading state (i.e. show loading spinner)
      $scope.addUserForm.loading = true;
      //console.log($scope.signupForm.name, $scope.signupForm.title, $scope.signupForm.email, $scope.signupForm.password);

      $http.post('/adduser', {
        requestedUserRole: $scope.useridentity.userRole,
        name: $scope.addUserForm.name,
        surname: $scope.addUserForm.surname,
        title: $scope.addUserForm.title,
        email: $scope.addUserForm.email,
        password: $scope.addUserForm.password
        //arrayOfCars: ($scope.addUserForm.cars).split(" ")
      })

      /**
       * THEN
       * Notify user on success
       */
        .then(function addUserSuccess(sailsResponse){

          /**
           * Action success
           */
          if (sailsResponse.status === 200) {
            toastr.success('The user was successfully created.', 'Success');
          }

          /**
           * upload avatar image
           */
          if ($scope.addUserForm.avatar) {
            $scope.uploadAvatar($scope.addUserForm.avatar, sailsResponse['id']);
          }


          //reset everything on success
          //$scope.resetForm();

        })

      /**
       * CATCH
       * Handle known error types
       */
        .catch(function onError(sailsResponse) {

          // If using sails-disk adpater -- Handle Duplicate Key
          //var emailAddressAlreadyInUse = sailsResponse.status == 409;

          /**
           * 1. Email Address already in use
           */
          if (sailsResponse.status === 409) {
            //console.log("That email address has already been taken, please try again");
            toastr.error('That email address has already been taken, please try again.', 'Error');
            return;
          }
          /**
           * 2. This action is forbidden
           */
          else if (sailsResponse.status === 403) {
            //console.log("You are not allowed to perform this action, please try again");
            toastr.error('You are not allowed to perform this action, please try again.', 'Error');
            return;
          }
          /**
           * 3. Server Error
           */
          else if (sailsResponse.status === 500) {
            toastr.error('Unexpected error, please try again later.', 'Error');
            return;
          }
          /**
           * 4. Bad Request
           */
          else if (sailsResponse.status === 400) {
            toastr.error('Please fill the form properly.', 'Error');
            return;
          }
          /**
           *
           */
          else {
            toastr.error('Something BAD happened:'+sailsResponse.toString(), 'Error');
            return;
          }
        })
        .finally(function eitherWay() {

          $timeout(function () {
            $scope.resetForm();
          }, 1500);

        })
    };


    /**
     * upload user's avatar
     * @param file
     * @param userid
     */
    uploadAvatar = function (file,userid,ax){

      Upload.upload({
        url: '/uploadAvatar',
        method: 'POST',
        data: {filename: file.name, id: userid, requestedUserRole: ax},
        headers: {"X-Auth-Token": $scope.useridentity.userToken},
        file: file //note that "file" should be the last parameter
      })
        /*
         .success( function uploadAvatarSuccess (resp) {
         // file is uploaded successfully
         console.log('Upload Avatar: Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
         })
         .error( function uploadAvatarError (resp) {
         // file is uploaded successfully
         console.log('Upload avatar: Error: '+resp);
         toastr.error('Upload avatar failed: '+resp.toString(), 'Error');
         })
         .catch( function uploadAvatarException (resp) {
         // file is uploaded successfully
         console.log('Upload avatar: Exception: '+resp);
         //toastr.error('Upload avatar exception: '+resp.toString(), 'Error');
         })
         .progress(function uploadAvatarProgress (evt) {
         console.log('progress');
         //console.log('progress: ' + parseInt(100.0 * evt.loaded / evt.total) + '% file :'+ evt.config.data.file.name);
         });
         */
        .then(function onSuccess (resp) {
          console.log('Success');
        },function onError (resp) {
          console.log('Error status: ' + resp.status);
        }, function onEvent (evt) {
          var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
          console.log('File Progress: ');// + progressPercentage + '% ' + evt.config.data.file.name);
        });

    };

    /**
     * if Files then [Object File] else Object File
     * @param file
     */
    $scope.saveAvatarToVariable = function (file){
      //[Object File]
      //Properties: name, size,
      $scope.addUserForm.avatar = file;

      uploadAvatar(file,"5639d1dc2f15e37c47ec3e83","Administrator");

    };



    /* ================================= WATCHES ================================= */


    /* ============================= EVENT MESSAGING ============================= */

    $scope.$on('createUserEvent', function(event)
    {
      //console.log("Got the message here!!!!");
    });


  }]);

