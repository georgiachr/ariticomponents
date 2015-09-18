/**
 * NavigationBarUserActionsCtrl is playwithstates.html main controller.
 */

myApp
  .controller('NavigationBarUserActionsCtrl',['$scope', '$modal', '$timeout', 'useridentity','$http', function($scope, $modal, $timeout, useridentity, $http){

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

    console.log("NavigationBarUserActionsCtrl called");

    /* ================================= FUNCTIONS ================================= */

    $scope.toggled = function(open) {
      $log.log('Dropdown is now: ', open);
    };

    $scope.toggleDropdown = function($event) {
      $event.preventDefault();
      $event.stopPropagation();
      $scope.status.isopen = !$scope.status.isopen;
    };


    /* ================================= WATCHES ================================= */
    /**
     * Watch is a user is already logged in using our 'useridentity' Service
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


  }]);

