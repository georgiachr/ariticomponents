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
    $scope.addUserForm.title = $scope.userRolesOptions[1];

    /* ================================= FUNCTIONS ================================= */
    $scope.la = function() {
      console.log("addUserForm.role = " + $scope.role);
    };


    /**
     * submitAddUserForm()
     * http request to SAILS
     */
    $scope.submitAddUserForm = function(){
      console.log("createUserCtrl - submitAddUserForm");


      // Set the loading state (i.e. show loading spinner)
      $scope.addUserForm.loading = true;
      //console.log($scope.signupForm.name, $scope.signupForm.title, $scope.signupForm.email, $scope.signupForm.password);

      /*TODO: rename signup to add */
      $http.post('/adduser', {
        requestedUserRole: $scope.useridentity.userRole,
        name: $scope.addUserForm.name,
        title: $scope.addUserForm.title,
        email: $scope.addUserForm.email,
        password: $scope.addUserForm.password
      })

        /**
         * THEN
         * Notify user on success
         */
        .then(function onSuccess(sailsResponse){

          /**
           * Action success
           */
          if (sailsResponse.status === 200) {
            toastr.success('The user was successfully created.', 'Success');
            return;
          }

          //reset everything
          //maybe show list of users here


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
          $scope.addUserForm.loading = false;
        })
    };


    /* ================================= WATCHES ================================= */


    /* ============================= EVENT MESSAGING ============================= */

    $scope.$on('createUserEvent', function(event)
    {
      console.log("Got the message here!!!!");
    });


  }]);

