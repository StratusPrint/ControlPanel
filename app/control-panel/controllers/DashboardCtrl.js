app.controller('DashboardCtrl', DashboardCtrl);

DashboardCtrl.$inject = ['$scope', '$q', 'hub', 'printer', 'sensor'];

function DashboardCtrl($scope, $q, hub, printer, sensor) {
  console.log('User Default Hub: ' + $scope.user._user.default_hub_id);

  $scope.printer = {};

  var defaultHubId = 27;
  // Var defaultHubId = $scope.user_user.default_hub_id;

  console.log('Using Hub id ' + defaultHubId + ' for now');
  // Var defaultHubPromise = hub.getHub(defaultHubId);

  /********************************************************
   * Promise Handling
   * Fetching all objects
   */
  var defaultHubPromise = hub.getHub(defaultHubId);
  defaultHubPromise.then(function(response) {
    $scope.hub = response;
  });

  var statsPromise = hub.getStatistics(defaultHubId);
  statsPromise.then(function(response) {
    $scope.stats = response;
  });

  var printersPromise = hub.getPrinters(defaultHubId);
  printersPromise .then(function(response) {
    $scope.printers = response;
    $scope.printer = $scope.printers[0];
  });

  var sensorsPromise = hub.getSensors(defaultHubId);
  sensorsPromise.then(function(_sensors) {
    var sensorDataPromises = [];
    $scope.sensors = _sensors;

    for (var i = 0; i < $scope.sensors.length; i++) {
      sensorDataPromises.push(sensor.getData($scope.sensors[i].id));
    }

    $q.all(sensorDataPromises).then(function(_data) {
      var sensorData = _data;

      for (var j = 0; j < sensorData.length; j++) {
        $scope.sensors[j].data = sensorData[j];
        var dataLength = $scope.sensors[j].data.length;
        $scope.sensors[j].newestDatum = $scope.sensors[j].data[dataLength - 1];
        if ($scope.sensors[j].data[dataLength - 1].value === '1' || $scope.sensors[j].data[dataLength - 1].value === '0') {
          if ($scope.sensors[j].data[dataLength - 1].value === '1') {
            $scope.sensors[j].newestDatum.value = 'True';
          } else {
            $scope.sensors[j].newestDatum.value = 'False';
          }
        }else {
          $scope.sensors[j].newestDatum.value = parseFloat($scope.sensors[j].data[dataLength - 1].value).toFixed(2);
        }
      }
    });
  });

  $scope.setPrinter = function(id) {
    for (var i = 0; i < $scope.printers.length; i++) {
      if ($scope.printers[i].id === id) {
        $scope.printer = $scope.printers[i];
      }
    }
  };

}
