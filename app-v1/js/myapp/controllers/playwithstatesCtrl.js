myApp
  .controller('PlaywithstatesCtrl',['$scope', '$modal', function($scope, $modal){

    //Debugging
    console.log("PlaywithstatesCtrl called");

    // Declarations
    $scope.animationsEnabled = true;

    /**
     * Creates and opens a modal window
     * @param size : modal window size (options: 'lg' or 'sm')
     */
    $scope.open = function (size) {

      // create a modal service
      var modalSignup = $modal.open({
        //animation: $scope.animationsEnabled,
        templateUrl: 'views/signup-form.html',
        controller: 'SignupModalCtrl'
      });
    }

    $scope.sayHello = function() {
      $scope.greeting = 'Hello ' + $scope.username + '!';
    };

  }]);

