app.controller('LoginCtrl', LoginCtrl);

LoginCtrl.$inject = ['$scope', '$auth'];

function LoginCtrl($scope, $auth) {
  $scope.login = function() {
    $auth.submitLogin($scope.loginForm)
            .then(function(resp) {
              // handle success response
              console.log('Logged in!?');
            })
            .catch(function(resp) {
              // handle error response
              console.log('Obviously got an error response!');
              $scope.loginErrorMessage = 'Sorry, but uh we couldn\'t find you, try again';
            });
  };
}
