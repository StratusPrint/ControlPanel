app.controller('ProfileCtrl', ProfileCtrl);

ProfileCtrl.$inject = ['$scope', 'auth'];

function ProfileCtrl($scope, auth, user) {
  $scope.alerts = [];

  $scope.save = function(profile) {
    if (!$scope.userForm.$valid) {
      $scope.addAlert('danger', 'Please correct the errors below and try submitting the form again.');
      return;
    }

    auth.updateAccount(profile)
      .then(function(resp) {
        $scope.closeAllAlerts();
        $scope.addAlert('success', 'Profile successfully updated.');
      })
      .catch(function(resp) {
        var errors = resp.data.errors;
        errors.forEach(function(error) { $scope.addAlert('danger', error); });
      });
  };

  $scope.addAlert = function(type, msg) {
    $scope.alerts.push({type: type, msg: msg});
  };

  $scope.closeAlert = function(index) {
    $scope.alerts.splice(index, 1);
  };

  $scope.closeAllAlerts = function() {
    $scope.alerts = [];
  };
}
