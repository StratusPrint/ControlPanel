app.controller('AuthCtrl', AuthCtrl);

AuthCtrl.$inject = ['$scope', '$state', '$stateParams', '$controller', 'auth'];

function AuthCtrl($scope, $state, $stateParams, $controller, auth) {
  // Inject alert controller scope
  $controller('AlertCtrl', { $scope: $scope });

  /**
   * Listen for login error events and display an alert.
   */
  $scope.$on('auth:login-error', function(ev, reason) {
    $scope.addAlert('danger', reason.errors.toString());
  });

  /**
   * Login a user.
   *
   * @param  {Object} user valid params for User model
   */
  $scope.login = function(user) {
    auth.login(user).then(function() {
      $state.go('dashboard.overview', {}, {inherit: false});
    });
  };

  /**
   * Logout the current user and then redirect
   * to login page.
   */
  $scope.logout = function() {
    auth.logout().then(function() {
      $state.go('login');
    });
  };

  /**
   * Request a password reset for a particular user.
   *
   * @param  {String} email the e-mail of the user requesting the password reset
   */
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

  /**
   * Update password of the current user.
   *
   * @param  {Object} data password and password_confirmation params
   */
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
   * Display default alerts according to parameters passed to login
   * state.
   */
  if ($stateParams.passwordResetEmailSent) {
    $scope.addAlert('info', 'Password reset instructions been have sent to your e-mail address.');
  }

  if ($stateParams.passwordReset) {
    $scope.addAlert('success', 'Your password has been successfully updated.');
  }

  if ($stateParams.accountConfirmed) {
    $scope.addAlert('success', 'Your account has been successfully confirmed. You can now login below.');
  }
}
