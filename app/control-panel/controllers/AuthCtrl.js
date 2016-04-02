app.controller('AuthCtrl', AuthCtrl);

AuthCtrl.$inject = ['$scope', 'auth'];

function AuthCtrl($scope, auth) {
  $scope.login = function(user) {
    auth.login(user);
  };

  $scope.logout = function() {
    auth.logout();
  };
}
