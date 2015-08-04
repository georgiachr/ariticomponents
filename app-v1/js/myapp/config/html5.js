/**
 * Created by georgia.chr on 03-Aug-15.
 */
/*
angular
  .module('ariti', [])*/
myApp.config([
    '$httpProvider',
    '$locationProvider',
    '$logProvider',
    function($httpProvider, $locationProvider,$logProvider) {
      // Expose XHR requests to server
      $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

      // This is `false` by default
      $locationProvider.html5Mode(true);
      $logProvider.debugEnabled(true);
    }
  ])
;
