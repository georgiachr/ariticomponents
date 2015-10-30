/**
 * Created by georgia.chr on 21-Sep-15.
 */

myApp
  .controller('CreateUserCtrl', ['$rootScope', '$scope', '$http', '$modal', 'toastr', 'useridentity', function($rootScope, $scope, $http, $modal, toastr, useridentity){

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


    }();

    $scope.printUserRole = function() {
      return $scope.addUserForm.title;
    };

    $scope.la = function() {
      //console.log("addUserForm.role = " + $scope.role);
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
        password: $scope.addUserForm.password,
        arrayOfCars: ($scope.addUserForm.cars).split(" ")
      })

        /**
         * THEN
         * Notify user on success
         */
        .then(function onSuccess(sailsResponse){

          /*Populate Cars*/
          /*TODO : populate cars here */

          /**
           * Action success
           */
          if (sailsResponse.status === 200) {
            toastr.success('The user was successfully created.', 'Success');
            return;
          }

          //reset everything on success
          $scope.resetForm();

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
          $scope.resetForm();
        })
    };

    $scope.uploadAvatarImage = function(avatarFile){

      var stringurl = "/images/"+avatarFile;

      console.log("image string is"+stringurl);



    };


    /* ================================= WATCHES ================================= */


    /* ============================= EVENT MESSAGING ============================= */

    $scope.$on('createUserEvent', function(event)
    {
      //console.log("Got the message here!!!!");
    });


  }]);

