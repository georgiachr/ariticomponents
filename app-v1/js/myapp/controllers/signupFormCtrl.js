/**
 * Created by georgia.chr on 14-Sep-15.
 */

myApp
  .controller('SignupFormCtrl', ['$scope', '$http', function($scope, $http){

  // set-up loading state
  $scope.signupForm = {
    loading: false
  };

  $scope.submitSignupForm = function(){

    // Set the loading state (i.e. show loading spinner)
    $scope.signupForm.loading = true;
    //console.log($scope.signupForm.name, $scope.signupForm.title, $scope.signupForm.email, $scope.signupForm.password);

    $http.post('/signup', {
      name: $scope.signupForm.name,
      title: $scope.signupForm.title,
      email: $scope.signupForm.email,
      password: $scope.signupForm.password
    })
      .then(function onSuccess(sailsResponse){
        console.log("SIGN-UP onSuccess state");
        //window.location = '/';
      })
      .catch(function onError(sailsResponse) {
        console.log("SIGN-UP catch state");
        // Handle known error type(s).
        // If using sails-disk adpater -- Handle Duplicate Key
        var emailAddressAlreadyInUse = sailsResponse.status == 409;

        if (emailAddressAlreadyInUse) {
          console.log("That email address has already been taken, please try again");
          //toastr.error('That email address has already been taken, please try again.', 'Error');
          return;
        }
      })
      .finally(function eitherWay() {
        console.log("SIGN-UP finally state");
        $scope.signupForm.loading = false;
      })
  };

}]);

