/**
 * Created by georgia.chr on 04-Aug-15.
 */


myApp
  .run(['$cookies','useridentity','editableOptions','$http',function($cookies,useridentity,editableOptions,$http) {
    editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
    mycookie = $cookies.getObject('userToken');

    if(mycookie != undefined){
      $http.get('/checkUserToken', {
        params: {email: mycookie.useremail,token:mycookie.token}

      })
      .then(function onSuccess(responseData){
        userData = angular.fromJson(responseData['data']);
        useridentity.loginUser(userData);
      })
      .catch(function onException(){

        })
      .finally();
    }


}]);
