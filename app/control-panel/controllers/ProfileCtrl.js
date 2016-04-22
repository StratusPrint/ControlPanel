app.controller('ProfileCtrl', ProfileCtrl);

ProfileCtrl.$inject = ['$scope', '$controller', 'auth'];

function ProfileCtrl($scope, $controller, auth) {
  // Inject alert controller scope
  $controller('AlertCtrl', { $scope: $scope });

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

    // Remove empty fields from profile to prevent errors
    Object.keys($scope.profile).forEach(function(key) {
      if ($scope.profile[key] === '') {
        delete $scope.profile[key];
      }
    });

    // Update user profile
    auth.updateAccount(profile)
      .then(function(resp) {
        $scope.addAlert('success', 'Profile successfully updated.');
        $scope.resetForm();
      })
      .catch(function(resp) {
        angular.forEach(resp.data.errors.full_messages, function(key, value) {
          $scope.addAlert('danger', key);
        });
      });
  };

  /**
   * Reset user form.
   */
  $scope.resetForm = function() {
    $scope.profile = {};
    $scope.userForm.$setPristine();
  };
}
