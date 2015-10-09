/**
 * Created by georgia.chr on 06-Oct-15.
 */

myApp
  .directive('createUserDirective', function () {
    return {
      restrict: 'AE',
      templateUrl: 'views/admin/createuser.html',

      link: function(scope, element, attrs){
        console.log("createuser directive");
      }
    }
  })
  .directive('anotherDirective', ['$compile', function ($compile) {
    return {
      restrict: 'AE',
      //templateUrl: "templates/humans.html",

      link: function(scope, element, attrs){
        console.log("another directive");
      }
    }
  }])
  .directive('showUserListDirective', ['$compile', function ($compile) {
    return {
      restrict: 'AE',
      templateUrl: "views/admin/showUserList.html"
    }
  }])
  .directive('showStatisticsDirective', ['$compile', function ($compile) {
    return {
      restrict: 'AE',
      //templateUrl: "templates/humans.html",

      link: function(scope, element, attrs){
        console.log("show statistics directive");
      }
    }
  }])
  .directive('otherOtherDirective', ['$compile', function ($compile) {
    return {
      restrict: 'AE',
      //templateUrl: "templates/mainview.html",

      link: function(scope, element, attrs){
        console.log("other other directive");
      }

    }
  }]);
