/**
 * Created by georgia.chr on 21-Sep-15.
 * UserActionsCtrl is topleftnavigation's controller (for ADMINISTRATOR)
 * It has all the main actions for Administrator: Users, Statistics etc
 */

myApp
  .controller('UserActionsCtrl', ['$rootScope','$scope', '$http', '$modal', 'toastr','useridentity', 'useractionservice', function($rootScope, $scope, $http, $modal, toastr, useridentity, useractionservice){

    /* ================================= DEBUGGING ================================= */

    console.log("Controller UserActionsCtrl called!");

    /* ================================= DECLARATIONS ============================== */

    /**
     * useridentity instance - use as public
     */
    $scope.useridentity = useridentity;

    /**
     * useractionservice instance - use as public
     */
    $scope.useractionservice = useractionservice;


    $scope.userName = $scope.useridentity.userName;

    $scope.addUserForm = {
      loading: false
    };

    /**
     * initialize service
     * Tell service that we work for Administrator
     */
    $scope.useractionservice.setUserAdmin();


    /* ================================= FUNCTIONS ================================= */

    /**
     * This function is fired up when an option is clicked (user press an option from nav bar).
     * @param action : the name of the action to be executed
     */
    $scope.selectMainAction = function (userAction) {

      //save user's selected action to the service
      $scope.useractionservice.setUserSelectedMainAction(userAction);

      if (userAction == 'users'){

      }
      else if (userAction == 'statistics'){

      }


    };


    /**
     * Add a new user Action using a Modal Window
     * @param size : set size of modal window
     */
    $scope.createNewUserModal = function (size) {

      $rootScope.$emit('createUserEvent', $scope.useridentity.userStatus);

      var modalInstance = $modal.open({
        animation: $scope.animationsEnabled,
        templateUrl: 'views/admin/addUser.html',
        controller: 'ModalCtrl',
        size: size
      })


    };

    /* ================================= WATCHES ================================= */







  }]);
