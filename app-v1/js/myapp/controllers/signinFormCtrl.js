/**
 * Created by georgia.chr on 14-Sep-15.
 */

myApp
  .controller('SigninFormCtrl',['$scope', '$http','$timeout','useridentity', function($scope, $http, $timeout, useridentity){

    /* D E C L A R A T I O N S */

    /**
     * instance of userAuthService
     * use with watch (other controllers)
     */
   $scope.userAuthServiceInstance = useridentity;



    $scope.loginForm = {};

    /* F U N C T I O N S */

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
          var config = angular.fromJson(responseData)['config'];

          /*TODO: create a userAuthServiceInstance method to set all these together*/
          //$scope.userAuthServiceInstance.setUser(data);
          $scope.userAuthServiceInstance.setToken(data['token']);
          $scope.userAuthServiceInstance.setRole(data['role']);
          $scope.userAuthServiceInstance.setHeader();
          $scope.userAuthServiceInstance.setUserStatus();

          /*Just to check if headers are now correct (use the token)*/
          $http.get('/').
            then(function(response) {
              // this callback will be called asynchronously
              // when the response is available
            }, function(response) {
              // called asynchronously if an error occurs
              // or server returns response with an error status.
            });

          /*watchandreact = function(isLoggedIn){
            isLoggedIn ? $scope.loginText = "logged in": $scope.loginText = "log out";
          }*/



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

  }]);

