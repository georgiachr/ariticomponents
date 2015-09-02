/**
 * Created by georgia.chr on 03-Aug-15.
 */

/**
 * Create a provider: enable ROUTING
 * use 'state' to define routes
 */

myApp
.config(function ($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('admin', {
      views: {
        "mainwindow": {
          //controller: 'SideMenuViewVideosCtrl'
          templateUrl: "views/admin/mainwindow.html"
        },
        "navleft": {
          templateUrl: "views/admin/navleft.html"
        },
        "navright": {
          templateUrl: "views/admin/navright.html"
        }
      }
    }
  )
    .state('admin.users', {
      views: {
        "detailinformation": {
          //controller: 'SideMenuViewVideosCtrl'
          templateUrl: "views/admin/users/mainwindow.html",
          parent: 'admin'
        }
      }
    }
  )
    .state('admin.nurses', {
      views: {
        "detailinformation": {
          //controller: 'SideMenuViewVideosCtrl'
          templateUrl: "views/admin/nurses.html",
          parent: 'admin'
        }
      }
    }
  )
    .state('nurse', {
      //url: '/nurse/',
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
    .state('sister', {
      //url: '/sister/',
      views: {
        "mainwindow": {
          templateUrl: "views/sister/mainwindow.html"
        },
        "navleft": {
          templateUrl: "views/sister/navleft.html"
        },
        "navright": {
          templateUrl: "views/sister/navright.html"
        }
      }
    }
  )
    .state('coordinator', {
      //url: '/coordinator/',
      views: {
        "mainwindow": {
          templateUrl: "views/coordinator/mainwindow.html"
        },
        "navleft": {
          templateUrl: "views/coordinator/navleft.html"
        },
        "navright": {
          templateUrl: "views/coordinator/navright.html"
        }
      }
    }
  )
});



