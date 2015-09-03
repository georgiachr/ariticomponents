myApp
  .controller('ModalCtrl',['$scope','$modalInstance', function($scope, $modalInstance){

    //Debugging
    console.log("ModalCtrl called");

    // Declarations

    $scope.ok = function () {
      $modalInstance.close();
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };





  }]);

