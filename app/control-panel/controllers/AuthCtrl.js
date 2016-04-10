app.controller('AuthCtrl', AuthCtrl);

AuthCtrl.$inject = ['$scope', '$state', '$stateParams', 'auth', 'hub'];

function AuthCtrl($scope, $state, $stateParams, auth, hub) {
  // List of open alerts
  $scope.alerts = [];

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
      $state.go('dashboard.overview');
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

  var promise = hub.getAllHubs();

  promise.then(function(_hubs) {
    console.log('response: ' + _hubs);
    $scope.hubs = _hubs;
    console.log('hubs: ' + JSON.stringify($scope.hubs));
  });

  $scope.viewHub = function(_hubId) {
    $state.go('dashboard.hubs.hubId', { hubId: _hubId });
  };

}
