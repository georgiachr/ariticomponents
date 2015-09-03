myApp
  .controller('SignupModalCtrl',['$scope','$modalInstance', function($scope, $modalInstance){

    //Debugging
    console.log("SignupModalCtrl called");

    // Declarations

    $scope.ok = function () {
      $modalInstance.close();
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };



  }]);

