/**
 * Created by georgia.chr on 03-Aug-15.
 */

/**
 * Create a provider: enable ROUTING
 * use 'state' to define routes
 */

angular.module('testApp', ['ui.router'])
.config(function ($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('nurse', {
      url: '/nurse/',
      views: {
        "mainwindow": {
          //controller: 'SideMenuViewVideosCtrl'
          templateUrl: "views/nurse/mainwindow.html"
        },
        "navleft": {
          templateUrl: "views/nurse/navleft.html"
        },
        "navright": {
          templateUrl: "views/nurse/navright.html"
        }
      }
    }
  )
    .state('main', {
      url: '/main/',
      views: {
        "mainwindow": {
          templateUrl: "views/main/mainwindow.html"
        },
        "navleft": {
          templateUrl: "views/main/navleft.html"
        },
        "navright": {
          templateUrl: "views/main/navright.html"
        }
      }
    }
  )
});



