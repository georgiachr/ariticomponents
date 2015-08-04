/**
 * Created by georgia.chr on 03-Aug-15.
 */
/*angular.module('ariti',[])*/
myApp.controller('hello', ['$scope', function($scope) {
    $scope.name = 'Tobias';
  }])
  .directive('topNavigation', function () {
    return {
      restrict: 'A',
      templateUrl: 'views/topnavigation.html',
      //template: '<div>bye bye</div>',
      link: function(scope, element, attrs){
        console.log("hello world");
      }
    }
  });
