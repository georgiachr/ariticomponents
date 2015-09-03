myApp
  .controller('PlaywithstatesCtrl',['$scope', '$modal', function($scope, $modal){

    //Debugging
    console.log("PlaywithstatesCtrl called");

    // Declarations

    /* a service */
    var modalInstance = $modal.open({
      //animation: $scope.animationsEnabled,
      templateUrl: 'views/signup-form.html',
      controller: 'ModalCtrl'
    });

  }]);

