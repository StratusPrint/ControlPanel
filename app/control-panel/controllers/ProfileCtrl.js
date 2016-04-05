app.controller('ProfileCtrl', ProfileCtrl);

ProfileCtrl.$inject = ['$scope', 'auth'];

function ProfileCtrl($scope, auth, user) {
  // List of open alerts
  $scope.alerts = [];

  $scope.save = function(profile) {
    // Check whether any validation errors are present on the form
    if (!$scope.userForm.$valid) {
      $scope.addAlert('danger', 'Please correct the errors below and try submitting the form again.');
      return;
    }

    // Check whether form has not been filled out
    if ($scope.userForm.$pristine) {
      $scope.addAlert('warning', 'Please fill out the form below before saving.');
      return;
    }

    // Update user profile
    auth.updateAccount(profile)
      .then(function(resp) {
        $scope.closeAllAlerts();
        $scope.addAlert('success', 'Profile successfully updated.');
        $scope.resetForm();
      })
      .catch(function(resp) {
        $scope.closeAllAlerts();
        var errors = resp.data.errors;
        errors.forEach(function(error) { $scope.addAlert('danger', error); });
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
   * Close all open alerts.
   */
  $scope.closeAllAlerts = function() {
    $scope.alerts = [];
  };

  /**
   * Reset user form.
   */
  $scope.resetForm = function() {
    $scope.profile = {};
    $scope.userForm.$setPristine();
  };
}
