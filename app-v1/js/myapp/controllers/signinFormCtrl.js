/**
 * Created by georgia.chr on 14-Sep-15.
 */

myApp
  .controller('SigninFormCtrl',['$scope', '$http','$timeout','useridentity', function($scope, $http, $timeout, useridentity){

    /* ================================= DEBUGGING ================================= */

    console.log("NavigationBarUserActionsCtrl called");


    /* ================================= DECLARATIONS ================================= */

    /**
     * instance of userAuthService
     * use with watch (other controllers)
     */
    $scope.userAuthServiceInstance = useridentity;

    $scope.loginForm = {};

    $scope.userName = null ;

    $scope.loggedUserOptionsButton = {
      status: true
    }



    /* ================================= FUNCTIONS ================================= */

    /**
     * Press the LOGOUT button
     *
     */
    $scope.pressLogoutButton = function () {

      console.log("inside pressLogoutButton");

      /**
       * Logout request to Sails
       */
      $http.get('/logout')
        .then(function onSuccess(responseData) {
          console.log("SIGN-OUT onSuccess state");
          $scope.userAuthServiceInstance.logoutUser();

        })
        .catch(function onError(sailsResponse) {
          // called asynchronously if an error occurs
          // or server returns response with an error status.

          console.log("SIGN-OUT onError state");
          $scope.userAuthServiceInstance.logoutUser();
        })
        .finally(function eitherWay() {
          console.log("SIGN-IN finally state");
        });

    }

    /**
     * Submits the LOGIN form
     *
     */
    $scope.submitLoginForm = function (){

      console.log("inside submitLoginForm");

      /**
       * req_send
       * req_received
       * req_error
       * @type {string}
       */
      $scope.state = "req_send";

      // Set the loading state (i.e. show loading spinner)
      $scope.loginForm.loading = true;


      $timeout(function(){
        if($scope.state == "req_send"){
          console.log("loginTimeout emit");
          $scope.$emit('loginTimeout');
        }
      },5000);

      // Submit request to Sails.
      // put(url, data, [config]);
      $http.put('/login', {
        email: $scope.loginForm.email,
        password: $scope.loginForm.password
      })
        .then(function onSuccess (responseData){
          console.log("SIGN-IN onSuccess state");

          var data = angular.fromJson(responseData)['data'];
          //var config = angular.fromJson(responseData)['config'];
          //console.log("data = " + JSON.stringify(data));
          //console.log("data = " + data.user['name']);
          $scope.userAuthServiceInstance.loginUser(data);


          /*
          * 1. Get the token from the response
          * 2. Use the angular service to save the token
          * 3. Use the angular service to indicate that login has been success
          * */
          $scope.state = "req_received";
          $scope.$emit('loginSuccess');

        })
        .catch(function onError(sailsResponse) {

          $scope.state = "req_error";

          console.log("SIGN-IN onError state"+sailsResponse.toString());
          // Handle known error type(s).
          // Invalid username / password combination.
          if (sailsResponse.status === 400 || 404) {
            // $scope.loginForm.topLevelErrorMessage = 'Invalid email/password combination.';

            console.log("Invalid email/password combination.");
            /*toastr.error('Invalid email/password combination.', 'Error', {
             closeButton: true
             });*/
            return;
          }

          console.log("An unexpected error occurred, please try again.");
          /*toastr.error('An unexpected error occurred, please try again.', 'Error', {
           closeButton: true
           });*/

          return;

        })
        .finally(function eitherWay(){
          console.log("SIGN-IN finally state");
          $scope.loginForm.loading = false;
        });

    };

    /**
     * Reset username and password fields
     */
    $scope.resetLoginForm = function (){
      $scope.loginForm.password = "";
      $scope.loginForm.email = "";
    };

    $scope.loggedUserOptionsButton.status = true;

    $scope.items = [
      'The first choice!',
      'And another choice for you.',
      'but wait! A third!'
    ];


    $scope.toggled = function(open) {
     console.log('Dropdown is now: ', open);
    };

    $scope.toggleDropdown = function() {

      $scope.loggedUserOptionsButton.status = !$scope.loggedUserOptionsButton.status;
    };

    /* ================================= WATCHES ================================= */
    /**
     * Watch is a user is already logged in using our 'useridentity' Service
     * If a user is logged in navHasLoginButton does not appear.
     */
    $scope.$watch('userAuthServiceInstance.userStatus',
      function(){
        if($scope.userAuthServiceInstance.userStatus) {
          $scope.userName = $scope.userAuthServiceInstance.userName;

        }
        else {

          $scope.resetLoginForm();
        }
      },
      true);


  }]);

