/**
 * NavigationBarUserActionsCtrl is playwithstates.html main controller.
 * Has Login, logout actions - these are the same for everyone
 * This controller is responsible to change states of the navtopleft
 */

myApp
  .controller('NavigationBarUserActionsCtrl',['$scope', '$modal', '$timeout', 'useridentity','$http', '$state', function($scope, $modal, $timeout, useridentity, $http, $state){

    /* ================================= DECLARATIONS ================================= */

    /**
     * useridentity instance - use as public
     */
    $scope.useridentity = useridentity;

    $scope.userName = $scope.useridentity.userName;

    //var modalSignup;

    $scope.animationsEnabled = true;

    $scope.loginText = "Login";

    /**
     * Value used to show or not the login / logout button on the navigation bar.
     * @type {boolean}
     */
    $scope.navHasLoginButton = true;

    /* ================================= DEBUGGING ================================= */

    console.log("Controller NavigationBarUserActionsCtrl called!");

    /* ================================= FUNCTIONS ================================= */


    /* ================================= WATCHES ================================= */
    /**
     * Watch if a user is already logged in using our 'useridentity' Service
     * If a user is logged in navHasLoginButton does not appear.
     */
    $scope.$watch('useridentity.userStatus',
      function(){
        if($scope.useridentity.userStatus) {
          $scope.loginText = "Logout";
          $scope.navHasLoginButton = false;
        }
        else {
          $scope.loginText = "Login";
          $scope.navHasLoginButton = true;

        }
      },
      true);

    /**
     * Change states based on user's role
     */
    $scope.$watch('useridentity.userRole',
      function(){
        if($scope.useridentity.userRole == 'Administrator') {
          $state.go('administrator');
        }
        else if($scope.useridentity.userRole == 'Nurse') {
          $state.go('nurse');
        }
        else{
          $state.go('guest');
        }
      },
      true);

  }]);

