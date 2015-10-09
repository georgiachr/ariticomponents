/**
 * Created by georgia.chr on 14-Sep-15.
 */

myApp
  .controller('SigninFormCtrl',['$scope', '$http','$timeout','useridentity', 'toastr',  function($scope, $http, $timeout, useridentity, toastr){

    /* ================================= DEBUGGING ================================= */

    console.log("Controller SigninFormCtrl called!");


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
       * LOGOUT request to Sails
       */
      $http.get('/logout')
        .then(function onSuccess(responseData) {

          /**
           *  Reset useridentity service
           *  There is no user data in this service
           */
          $scope.userAuthServiceInstance.logoutUser();

        })
        .catch(function onError(sailsResponse) {

          // called asynchronously if an error occurs
          // or server returns response with an error status.

          /**
           *  Reset useridentity service
           *  There is no user data in this service
           */
          $scope.userAuthServiceInstance.logoutUser();
        })
        .finally(function eitherWay() {
        });

    };

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
      /**
       * Handle known error types.
       */
        .catch(function onError(sailsResponse) {

          $scope.state = "req_error";
          //console.log("SIGN-IN onError state"+sailsResponse.toString());


          /**
           * 1. Invalid username / password combination.
           */
          if (sailsResponse.status === 400 || 404) {
            toastr.error('Invalid email/password combination.', 'Error');
            return;
          }
          /**
           * 2. Server Error (500)
           */
          else if (sailsResponse.status === 500) {
            toastr.error('Unexpected error, please try again later.', 'Error');
            return;
          }
          /**
           * 2. Server Error (500)
           */
          else {
            toastr.error('Something BAD happened:'+sailsResponse.toString(), 'Error');
            return;
          }

        })
        .finally(function eitherWay(){
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

