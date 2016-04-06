app.controller('AuthCtrl', AuthCtrl);

AuthCtrl.$inject = ['$scope', '$state', 'auth'];

function AuthCtrl($scope, $state, auth) {
  // List of open alerts
  $scope.alerts = [];

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

  $scope.requestPasswordReset = function(email) {
    auth.requestPasswordReset(email).then(function(resp) {
      $scope.addAlert('info', 'Password reset instructions have sent to your e-mail address.');
    })
    .catch(function(resp) {
      $scope.addAlert('info', 'Unable to request a password reset. Please try again.');
    });
  };

  $scope.updatePassword = function(data) {
    // jscs:disable
    data.current_password = 'dummypassword';
    // jscs:enable
    auth.updatePassword(data).then(function(resp) {
      $scope.addAlert('success', 'Your password has been successfully updated.');
    })
    .catch(function(resp) {
      $scope.addAlert('danger', 'Unable to update your password. Please try again.');
    });
  };

  /**
   * Add an alert to the view.
   *
   * @param {enum} type 'danger', 'warning', etc...
   * @param {String} msg  The alert message
   */
  $scope.addAlert = function(type, msg) {
    $scope.alerts.push({type: type, msg: msg});
  };

  /**
   * Close an open alert.
   *
   * @param  {Integer} index The index of the alert
   */
  $scope.closeAlert = function(index) {
    $scope.alerts.splice(index, 1);
  };
}
