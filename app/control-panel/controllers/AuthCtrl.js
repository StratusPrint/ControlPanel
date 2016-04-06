app.controller('AuthCtrl', AuthCtrl);

AuthCtrl.$inject = ['$scope', '$state', '$stateParams', 'auth'];

function AuthCtrl($scope, $state, $stateParams, auth) {
  // List of open alerts
  $scope.alerts = [];

  $scope.$on('auth:login-error', function(ev, reason) {
    $scope.addAlert('danger', reason.errors.toString());
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
      $state.go('login', { passwordResetEmailSent: true });
    })
    .catch(function(resp) {
      if (resp.data.errors.length) {
        $scope.addAlert('danger', resp.data.errors[0]);
      } else {
        $scope.addAlert('danger', 'Unable to request a password reset. Please try again.');
      }
      console.log(resp);
    });
  };

  $scope.updatePassword = function(data) {
    auth.updatePassword(data).then(function(resp) {
      $state.go('login', { passwordReset: true });
    })
    .catch(function(resp) {
      if (resp.data.errors.length) {
        $scope.addAlert('danger', resp.data.errors[0]);
      } else {
        $scope.addAlert('danger', 'Unable to update your password. Please try again.');
      }
      console.log(resp);
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

  /**
   * Display default alerts according to parameters passed to login
   * state.
   */
  if ($stateParams.passwordResetEmailSent) {
    $scope.addAlert('info', 'Password reset instructions been have sent to your e-mail address.');
  }

  if ($stateParams.passwordReset) {
    $scope.addAlert('success', 'Your password has been successfully updated.');
  }
}
