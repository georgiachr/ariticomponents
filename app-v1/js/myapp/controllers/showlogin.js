/**
 * Created by georgia.chr on 26-Aug-15.
 *
 */
myApp.controller('ShowLogin', ['$scope','loginService', 'myProfileService', function($scope, loginService, myProfileService){

  /**
   * SCOPE VARIABLES
   */
  $scope.theloginService = loginService;
  $scope.themyprofileservice = myProfileService;
  $scope.loginText = $scope.theloginService.status? "logged in" : "logged out";

  /**
   * SCOPE FUNCTIONS
   */


  /**
   * FUNCTIONS
   */
  watchandreact = function (modified){
    console.log("modified");
  }

  /**
   * WATCHES
   */
  $scope.$watch('theloginService.isLogin()', function(isLoggedIn){
    isLoggedIn ? $scope.loginText = "logged in": $scope.loginText = "log out";
  }, true);
  $scope.$watch('themyprofileservice.getChanges()',watchandreact,true);

  /**
   * DOM EVENTS
   */

  /**
   * MESSAGES
   */
}]);
