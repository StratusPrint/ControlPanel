app.controller('AuthCtrl', AuthCtrl);

AuthCtrl.$inject = ['$scope', '$state', '$stateParams', 'auth', 'alert'];

function AuthCtrl($scope, $state, $stateParams, auth, alert) {
  // List of open alerts
  $scope.alerts = alert.get();

  /**
   * Listen for login error events and display an alert.
   */
  $scope.$on('auth:login-error', function(ev, reason) {
    alert.add('danger', reason.errors.toString());
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
        alert.add('danger', resp.data.errors[0]);
      } else {
        alert.add('danger', 'Unable to request a password reset. Please try again.');
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
        alert.add('danger', resp.data.errors[0]);
      } else {
        alert.add('danger', 'Unable to update your password. Please try again.');
      }
      console.log(resp);
    });
  };

  /**
   * Display default alerts according to parameters passed to login
   * state.
   */
  if ($stateParams.passwordResetEmailSent) {
    alert.add('info', 'Password reset instructions been have sent to your e-mail address.');
  }

  if ($stateParams.passwordReset) {
    alert.add('success', 'Your password has been successfully updated.');
  }

  if ($stateParams.accountConfirmed) {
    alert.add('success', 'Your account has been successfully confirmed. You can now login below.');
  }
}
