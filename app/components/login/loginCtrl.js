theApp.controller('loginCtrl', function($scope,$auth) {
  $scope.handleLoginBtnClick = function() {
    $auth.submitLogin($scope.loginForm)
    .then(function(resp) {
      console.log("Logged in!?");
      // handle success response
    })
    .catch(function(resp) {
      console.log($scope.loginForm);
      console.log("Obviously got an error response!");
      $scope.loginErrorMessage = "Sorry, but uh we couldn't find you, try again";
      // handle error response
    });
  };
});


