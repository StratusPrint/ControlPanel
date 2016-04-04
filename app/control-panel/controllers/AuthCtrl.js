app.controller('AuthCtrl', AuthCtrl);

AuthCtrl.$inject = ['$scope', '$state', 'auth'];

function AuthCtrl($scope, $state, auth) {
  $scope.$on('auth:login-error', function(ev, reason) {
    $scope.error = reason.errors.toString();
  });

  $scope.login = function(user) {
    auth.login(user).then(function() {
      $state.go('dashboard.overview');
    });
  };

  $scope.logout = function() {
    auth.logout().then(function() {
      $state.go('login');
    });
  };
}
