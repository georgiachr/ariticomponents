/**
 * Created by georgia.chr on 07-Oct-15.
 */

myApp
  .controller('AdminMainWindowCtrl', ['$scope', '$http', 'toastr','useridentity', 'useractionservice', function($scope, $http, toastr, useridentity, useractionservice){

    /* ================================= DEBUGGING ================================= */

    console.log("Controller AdminMainWindowCtrl called!");

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
     * Each action is connected to the appropriate directive's ng-show
     * @type {{createUser: boolean, otherAction: boolean}}
     */
    $scope.mainAdminActions = {
      users: false,
      statistics: false
    };

    $scope.secondaryAdminActions = {
      users: {
        list: false,
        add: false
      },
      statistics: {
        cpu: false,
        memory: false
      }
    };
    //all false


  /* ================================= FUNCTIONS ================================= */

    /**
     * Reset $scope.userActionsList
     */
    $scope.resetMainWindow = function(){
      $scope.mainAdminActions.users = false;
      $scope.mainAdminActions.statistics = false;
    };

    //function to all false secondary
    $scope.resetMainWindowSecondaryActions = function(){
      $scope.secondaryAdminActions.users.list = false;
      $scope.secondaryAdminActions.users.add = false;
      $scope.secondaryAdminActions.statistics.cpu = false;
      $scope.secondaryAdminActions.statistics.memory = false;
    };



  /* ================================= WATCHES ================================= */

  /**
   * change of main action
   * Watch admin's current navtopleft action from 'useractionservice' Service
   * hide or show directives respectively
   */
  $scope.$watch('useractionservice.mainActiveAction',
    function(){
      $scope.resetMainWindow();

      //if you change the main action then the secondary action should be reset
      $scope.useractionservice.resetSecondaryAction();

      if($scope.useractionservice.mainActiveAction == 'users') {
        $scope.mainAdminActions.users = true;
      }
      else if ($scope.useractionservice.mainActiveAction == 'statistics') {
        $scope.mainAdminActions.statistics = true;
      }
    },
    true);

    //change of secondary action
    $scope.$watch('useractionservice.secondaryActiveAction',
      function(){

        //all going to false
        //$scope.resetMainWindow();

        //all going to false
        $scope.resetMainWindowSecondaryActions();

        if ($scope.useractionservice.getMainAction() == 'users')
        {
          if (useractionservice.getSecondaryAction() == 'add'){
            $scope.secondaryAdminActions.users.add = true;
          }
          else if (useractionservice.getSecondaryAction() == 'list'){
            $scope.secondaryAdminActions.users.list = true;
          }

        }
        else if (useractionservice.getMainAction() == 'statistics')
        {
          if (useractionservice.getSecondaryAction() == 'cpu'){
            $scope.secondaryAdminActions.statistics.cpu = true;
          }
          else if (useractionservice.getSecondaryAction() == 'memory'){
            $scope.secondaryAdminActions.statistics.memory = true;
          }

        }


      },
      true);




  }]);
