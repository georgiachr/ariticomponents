/**
 * Created by georgia.chr on 21-Sep-15.
 */

myApp
  .controller('ShowListOfUsersCtrl', ['$scope', '$http', '$modal', 'toastr', 'useridentity', '$timeout', function($scope, $http, $modal, toastr, useridentity, $timeout) {

    /* ================================= DEBUGGING ================================= */

    console.log("Controller ShowListOfUsersCtrl called!");

    /* ================================= DECLARATIONS ================================= */

    /**
     * useridentity instance - use as public
     */
    $scope.useridentity = useridentity;

    //collection of users
    $scope.displayedUserList = [];
    $scope.userListFromServer = [];

    //Pagination variables
    $scope.paginationNumberOfItemsByPage = 4;
    $scope.paginationPagesToShow = 0;
    $scope.paginationTotalItems = 0;
    $scope.paginationTotalPages = 0;
    $scope.paginationCurrentPage = 1; //by default
    $scope.paginationMaxNumberOfPages = 10;


    //Search variables
    $scope.searchText = null;

    //other variables
    $scope.isLoading = false;


    ///////////////////////////////////////////////////////////////
    function setInMemoryURL(data){

      /*
       var urlCreator = window.URL || window.webkitURL;
       var img = document.querySelector( "#animg" );
       */
      $scope.inMemoryURL = 'data:image/png;base64,'+data;
    }

    $scope.acceptSelect = true;

    /**
     * Image file raw data
     */
    $scope.image;

    /**
     * in memory URL
     * @param file
     */
    $scope.inMemoryURL;




    /* ================================= FUNCTIONS ================================= */
    /* Keep in mind the ORDER functions are called */

    /**
     * Used for PAGINATION issues
     * Calculate the total number of pages based on the number of items and the paginationItemsByPage
     * The $scope.paginationTotalPages variable is initialized
     * @param numberOfTotalItemsRetrievedFromDb : the total number of records for this model
     */
    $scope.calculateTotalNumberOfPagesForPagination = function (numberOfTotalItemsRetrievedFromDb){

      $scope.paginationTotalPages = Math.ceil(numberOfTotalItemsRetrievedFromDb / $scope.paginationNumberOfItemsByPage);
      $scope.paginationTotalItems = numberOfTotalItemsRetrievedFromDb;

    };


    /**
     *
     */
    $scope.prepareAndDisplayCurrentPageOfUsers = function (){

      //calculate pagination start index for this page
      $scope.paginationGetListStartIndex = (($scope.paginationCurrentPage - 1) * $scope.paginationNumberOfItemsByPage) + 1 ;

      //AJAX call to server
      $scope.getListOfUsersFromDB();

    };


    /**
     * getListOfUsersFromDB() gets all users from the DB
     * Auto-called function when controller called.
     * The first page is the initial page user can see
     */
    $scope.getListOfUsersFromDB = function() {

      //Access Server
      $http.get('/userlist', {
        params:
        {
          requestedUserRole: $scope.useridentity.userRole,
          paginationGetListStartIndex: $scope.paginationGetListStartIndex,
          pageSize: $scope.paginationNumberOfItemsByPage,
          searchText: $scope.searchText
        }
      })

      /**
       * PROMISE SUCCESSFUL : retrieve users
       * Notify user on success
       */
        .then(function onSuccess(responseData) {
          //console.log("as array = " + angular.toJson(responseData));

          // 'data' is GET-declared by default.
          var dataReceived = angular.fromJson(responseData['data']);

          //initialize variables
          $scope.userListFromServer = dataReceived['listOfUsers'];
          $scope.paginationTotalItems = dataReceived['totalNumberOfUsers'];

          $scope.calculateTotalNumberOfPagesForPagination($scope.paginationTotalItems);

          $scope.image = dataReceived[1].file.data;
          setInMemoryURL(base64ArrayBuffer(dataReceived[1].file.data));



          //$timeout(function(){$scope.itemsByPage = 8},100);
          $scope.isLoading = false;

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

        });

      //used for pagination
      //$scope.copyOriginalListToDisplayedList();

    };

    /**
     *
     */
    getListOfUsersFromDBAutoCall = function(){

      //need something here to pre-calculate total number of pages

      $scope.prepareAndDisplayCurrentPageOfUsers();
    }();


    /**
     * Save user changes after editing.
     * @param index
     */
    $scope.saveUser = function(index) {

      /* $scope.user not updated yet */
      //angular.extend(data, {id: id});

      /* call updateUser to save changes to DATABASE using HTTP POST */

      $timeout(function(){$scope.updateUserToDb(index);},10);

    };




    /**
     * HTTP POST to sails to save the user
     * @param index : index of user from userList
     */
    $scope.updateUserToDb = function(index){

      $http.post('/updateuser', {
        requestedUserRole: $scope.useridentity.userRole,
        id: $scope.userListFromServer[index].id,
        name: $scope.userListFromServer[index].name,
        email: $scope.userListFromServer[index].email
      })

      /**
       * THEN
       * Notify user on success
       */
        .then(function onSuccess(sailsResponse){

          /**
           * Action success
           */
          if (sailsResponse.status === 200) {
            toastr.success('The user was successfully updated.', 'Success');
            return;
          }

        })

      /**
       * CATCH
       * Handle known error types
       */
        .catch(function onError(sailsResponse) {

          toastr.error('Failed to update user:'+sailsResponse.toString(), 'Error');
          return;

        })
        .finally(function eitherWay() {

        })
    };

    /**
     * Remove user from SAILS using HTTP POST
     * @param index : the user to be deleted
     */
    $scope.removeUserFromDb = function(index){

      $http.post('/removeuser', {
        requestedUserRole: $scope.useridentity.userRole,
        id: $scope.userListFromServer[index].id
      })

      /**
       * THEN
       * Notify user on success
       */
        .then(function onSuccess(sailsResponse){

          /**
           * Action success
           */
          if (sailsResponse.status === 200) {
            toastr.success('The user was successfully deleted.', 'Success');
            return;
          }

        })

      /**
       * CATCH
       * Handle known error types
       */
        .catch(function onError(sailsResponse) {

          toastr.error('Failed to remove user:'+sailsResponse.toString(), 'Error');
          return;

        })
        .finally(function eitherWay() {

        })
    };

    /**
     * Remove user from the list:
     * A. Removes user from Database (calls the removeUserFromDb )
     * B. Removes user from List (deletes data in userList[index] )
     * @param index : the array position of the user to be deleted
     */
    $scope.removeUser = function(index) {

      /* Removes user from the database using HTTP POST */
      $scope.removeUserFromDb(index);

      /* update scope list - ANGULAR remove the user in index position */
      $scope.userListFromServer.splice(index,1);

    };

    /**
     * testing function
     * @param start
     * @param number
     * @param params
     * @returns {*}
     */
    $scope.prepareToGetPage = function(start, number, params) {

      return $resource('/userlist', {}, {
        query: {method:'GET', params:{requestedUserRole: '$scope.useridentity.userRole'}, config:{}}
      });


      var deferred = $q.defer();

      var filtered = params.search.predicateObject ? $filter('filter')(randomsItems, params.search.predicateObject) : randomsItems;

      if (params.sort.predicate) {
        filtered = $filter('orderBy')(filtered, params.sort.predicate, params.sort.reverse);
      }

      var result = filtered.slice(start, start + number);

      $timeout(function () {
        //note, the server passes the information about the data set size
        deferred.resolve({
          data: result,
          numberOfPages: Math.ceil(filtered.length / number)
        });
      }, 1500);


      return deferred.promise;
    };



    /* ================================= WATCHES ================================= */
    $scope.$watch('useractionservice.secondaryActiveAction',
      function(){

        if($scope.useractionservice.secondaryActiveAction == 'list') {
          $scope.useractionservice.secondaryActiveAction == null;
        }
      },
      true);

    //$timeout($scope.getListOfUsers(),10);
    //console.log("paginationPagesToShow = " + $scope.paginationPagesToShow);

    /* ============================= EVENT MESSAGING ============================= */



  }]);

