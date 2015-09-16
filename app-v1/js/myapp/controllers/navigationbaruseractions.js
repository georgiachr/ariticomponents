/**
 * NavigationBarUserActionsCtrl is playwithstates.html main controller.
 */

myApp
  .controller('NavigationBarUserActionsCtrl',['$scope', '$modal', '$timeout', 'useridentity','$http', function($scope, $modal, $timeout, useridentity, $http){

    var modalSignin;
    var modalSignup;

    $scope.useridentity = useridentity;

    //Debugging
    console.log("NavigationBarUserActionsCtrl called");

    // Declarations
    $scope.animationsEnabled = true;


    /**
     *
     * Ask service if we are logged in
     *
     */
    $scope.loginText = "Login";

    /**
     * Creates and opens a modal window
     * @param size : modal window size (options: 'lg' or 'sm')
     * @param isAdd : if the modal is signup or signin
     */
    $scope.open = function (size) {


      if ($scope.useridentity.userStatus == true)
      {
        // create a modal service


        $scope.useridentity.resetUserStatus();
        $scope.loginText = "Login";

        /**
         * Ask if you want really to logout
         */
        $http.get('/logout').
          then(function(response) {
            // this callback will be called asynchronously
            // when the response is available
          }, function(response) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
          });

      }
      else
      {
        // create a modal service
        modalSignin = $modal.open({
          //animation: $scope.animationsEnabled,
          templateUrl: 'views/signin-form.html',
          controller: 'ModalCtrl'
        });
      }

      $scope.$on("loginSuccess",function(){
        console.log("loginSuccess received");
        if(modalSignin !== undefined){
          modalSignin.close();
        }

      });

      $scope.$on("loginTimeout",function(){
        console.log("loginTimeout received");
        if(modalSignin !== undefined){
          modalSignin.close();
        }
      });

      /*
       * 1. Watch for the angular service to successfully get the token
       * 2. The switch off
       * */


    };


    $scope.$watch('useridentity.userStatus',
      function(){
        if($scope.useridentity.userStatus)
          $scope.loginText = "Logout";
        else
          $scope.loginText = "Login";
      },
      true);


  }]);

