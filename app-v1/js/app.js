/**
 * Created by nstyl on 01-Aug-15.
 */
// client/app.js
  /* *
  Main module declaration
  Declare a list of dependencies here (for example ui.router)
  * */
var myApp = angular.module('ariti', ['ngFileUpload','ngResource','ngCookies','smart-table','ngAnimate','ui.router','ui.bootstrap.modal','ui.bootstrap.tpls','ui.bootstrap','toastr','xeditable','ng.bs.dropdown']);

/* MODULES explanation */
/*
  1. ui.router (stateProvider) vs ngRoute (routeProvider): ui.router both used for SPA but: ui.router is used to define multiple states - routeProvider is used only for a single view
  2. ngAnimate
  3. ui.bootstrap: angular directives for bootstrap
  4. ngResource: The ngResource module provides interaction support with RESTful services via the $resource service. $resource is a factory which creates a resource object that lets you interact with RESTful server-side data sources.
  5. ngCookies:
  6. smart-table:
  7. ngFileUpload: module to upload files from angular



 */
