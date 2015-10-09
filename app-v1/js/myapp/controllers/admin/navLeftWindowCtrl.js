myApp
  .controller('AdminNavLeftWindowCtrl', ['$scope', '$http', 'toastr','useridentity', 'useractionservice', function($scope, $http, toastr, useridentity, useractionservice){

    /* ================================= DEBUGGING ================================= */

    console.log("Controller AdminNavLeftWindowCtrl called!");

    /* ================================= DECLARATIONS ============================== */

    /**
     * useridentity instance - use as public
     */
    $scope.useridentity = useridentity;

    /**
     * useractionservice instance - use as public
     */
    $scope.useractionservice = useractionservice;

    /**
     * Hide or Show Divs
     * Set initial values (all hidden)
     * @type {{users: boolean, statistics: boolean}}
     */
    $scope.mainAdminActions = {
      users: false,
      statistics: false
    };



    /* ================================= FUNCTIONS ================================= */

    /**
     * Reset $scope.userActionsList
     */
    $scope.resetNavLeftWindow = function(){
      $scope.mainAdminActions.users = false;
      $scope.mainAdminActions.statistics = false;
    };

    /**
     * This function is fired up when a secondary option is clicked (user press an option from left nav bar).
     * @param action : the name of the action to be executed
     */
    $scope.selectSecondaryAction = function (userAction) {

      //everytime user clicks an option then the current option is saved to the service
      $scope.useractionservice.setUserSelectedSecondaryAction(userAction);

      //trigger action - call function again


    };




    /* ================================= WATCHES ================================= */

    $scope.$watch('useractionservice.mainActiveAction',
      function(){
        $scope.resetNavLeftWindow();
        $scope.useractionservice.resetSecondaryAction();

        if($scope.useractionservice.mainActiveAction == 'users') {
          $scope.mainAdminActions.users = true;
        }
        else if ($scope.useractionservice.mainActiveAction == 'statistics') {
          $scope.mainAdminActions.statistics = true;
        }
      },
      true);

  }]);
