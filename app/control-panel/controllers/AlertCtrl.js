app.controller('AlertCtrl', AlertCtrl);

AlertCtrl.$inject = ['$scope'];

function AlertCtrl($scope) {
  $scope.alerts = [];

  $scope.addAlert = function(type, msg) {
    return $scope.alerts.push({
      type: type,
      msg: msg,
      close: function() {
        return $scope.closeAlert(this);
      },
    });
  };

  $scope.closeAlert = function(alert) {
    return closeAlertIdx($scope.alerts.indexOf(alert));
  };

  $scope.closeAlertIdx = function(index) {
    return $scope.alerts.splice(index, 1);
  };

  $scope.clearAlerts = function() {
    $scope.alerts = [];
  };
}
