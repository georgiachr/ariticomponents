
/**
 * Created by georgia.chr on 15-Sep-15.
 * This service holds a user, their details and http changes
 * The service can be shared among controllers (define the service's name as dependency injection )
 */

/**
 * TODO: write all these into cookies (run.js)
 */

myApp
  .service('useridentity', ['$http',function($http) {

    return {
      userStatus: false, // if we have a user
      userToken: null, userID:null,
      userRole: null,
      userConfigHeaders: null,

      user:{
        token: null,
        role: null,
        status: false,
        id: null
      },

      setUser: function setUser(){
        this.user.status = true;
        this.user.token = token;
        this.user.role = role;
        this.user.id = id;
      },

      isLogin: function isLogin() {
        console.log('isLogin');
        return this.status;
      },
      setLogin: function setLogin() {
        console.log('setLogin');
        this.status = true;
      },
      setLogout: function setLogout() {
        console.log('isLogout');
        this.status = false;
      },
      setToken: function setToken(token){
        console.log('userAuthService - setToken');
        this.userToken = token;
      },
      setID: function setID(id){
        console.log('userAuthService - setID');
        this.userID = id;
      },
      setRole: function setRole(role){
        console.log('userAuthService - setRole');
        this.userRole = role;
      },
      setHeader: function setHeaders(){
        console.log('userAuthService - setHeader');
        //this.userConfigHeaders = config;
        $http.defaults.headers.common['X-Auth-Token'] = this.userToken;
        //set the X-AUTH-TOKEN

      },
      resetHeader: function resetHeaders(){
        console.log('userAuthService - resetHeader');
        this.userConfigHeaders = config;
        this.userConfigHeaders.headers.Authorization = '';
        //set the X-AUTH-TOKEN
      },
      getConfig: function getConfig() {
        return this.userConfigHeaders;
      },
      setUserStatus: function setUserStatus() {
        this.userStatus = true;
      },
      resetUserStatus: function resetUserStatus() {
        this.userStatus = false;
      }
    }

  }]);
