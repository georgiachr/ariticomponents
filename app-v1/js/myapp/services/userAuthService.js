
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
      userName: null,

      setUser: function setUser(data){
        this.userName = data.user['name'];
        this.userToken = data.user['token']; /* user's token */
        this.userRole = data.user['title']; /* */
        this.userID = data.user['id'];

      },

      loginUser: function loginUser(data){
        this.userStatus = true; /* there is a logged in user */
        this.setUser(data);
        this.setHeader();
      },

      logoutUser: function logoutUser(){
        this.userStatus = false;
        this.reset();
      },

      reset: function reset(){
        this.userToken = null,
        this.userID = null,
        this.userName = null;
        this.userRole = null,
        this.userConfigHeaders = null
      },

      isLogin: function isLogin() {
        //console.log('isLogin');
        return this.status;
      },
      setLogin: function setLogin() {
        //console.log('setLogin');
        this.status = true;
      },

      setHeader: function setHeaders(){

        $http.defaults.headers.common['X-Auth-Token'] = this.userToken;
        //set the X-AUTH-TOKEN

      },
      resetHeader: function resetHeaders(){
        //console.log('userAuthService - resetHeader');
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
