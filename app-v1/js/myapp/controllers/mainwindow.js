myApp
  .controller('MainWindow',['$scope','loginService', 'myProfileService', function($scope, loginService, myProfileService){

    // Declarations
    $scope.loginStatus = loginService.isLogin();

    /**
     *
     * @param $event
     */
    $scope.statusChanged = function($event) {
      var checkmode = $event.target;
      if (checkmode.checked) {
      //if ($scope.loginStatus)
      loginService.setLogin();
        myProfileService.setGender("male");
      }
      else {
        loginService.setLogout();
        myProfileService.setName("Giorgos");
      }
    };
}]);

