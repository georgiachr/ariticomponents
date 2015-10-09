/**
 * Created by georgia.chr on 21-Sep-15.
 */

myApp
  .controller('ShowListOfUsersCtrl', ['$scope', '$http', '$modal', 'toastr', 'useridentity', 'NgTableParams', function($scope, $http, $modal, toastr, useridentity, NgTableParams) {

    /* ================================= DEBUGGING ================================= */

    console.log("Controller ShowListOfUsersCtrl called!");


    /* ================================= DECLARATIONS ================================= */

    /**
     * useridentity instance - use as public
     */
    $scope.useridentity = useridentity;


    $scope.userList = [{name: 'christian', age: 21, email: 's@e.v'}, {name: 'anthony', age: 88, email: 's@e.v'}];
    $scope.tableParams = new NgTableParams(
      { //settings
        page: 1, // show first page
        count: 10 // count per page
      },
      { //data
        data: $scope.userList
      }
    );

    /* ================================= FUNCTIONS ================================= */

    $scope.getListOfUsers = function() {

      $http.get('/userlist', {
        params: {requestedUserRole: $scope.useridentity.userRole}
      })

      /**
       * THEN retrieve users
       * Notify user on success
       */
        .then(function onSuccess(responseData) {

          // 'data' is by default.
          $scope.userList = angular.fromJson(responseData['data']);

          //console.log('data = ' + data[0].name);

          /**
           * Action success
           */
          /*if (sailsResponse.status === 200) {
            toastr.success('The list was successfully retrieved.', 'Success');
            return;
          }*/

        })

      /**
       * CATCH
       * Handle known error types
       */
        .catch(function onError(sailsResponse) {


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
            toastr.error('Something BAD happened:' + sailsResponse.toString(), 'Error');
            return;
          }
        })
        .finally(function eitherWay() {
          ;
        })
    };



    /* ================================= WATCHES ================================= */
    $scope.$watch('useractionservice.secondaryActiveAction',
      function(){

        if($scope.useractionservice.secondaryActiveAction == 'list') {
          $scope.getListOfUsers();
          $scope.useractionservice.secondaryActiveAction == null;
        }
      },
      true);




    /* ============================= EVENT MESSAGING ============================= */



  }]);

