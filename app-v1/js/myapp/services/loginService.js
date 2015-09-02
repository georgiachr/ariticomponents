myApp
  .service('loginService', [function() {
    return {
      status: true,
      isLogin: function isLogin(){
        console.log('isLogin');
        return this.status;
      },
      setLogin: function setLogin(){
          console.log('setLogin');
          this.status = true;
      },
      setLogout: function setLogout(){
        console.log('isLogout');
        this.status = false;}
    }
}]);
