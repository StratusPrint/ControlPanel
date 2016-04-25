app.controller('DashboardCtrl', DashboardCtrl);

DashboardCtrl.$inject = ['$scope', '$q', 'hub', 'printer', 'sensor'];

function DashboardCtrl($scope, $q, hub, printer, sensor) {
  $scope.printer = {};
  var defaultHubId = $scope.user._user.default_hub_id;
  console.log('using hub: ' + defaultHubId);

  /********************************************************
   * Methods and chart handling
   */

  /**
   * SetPrinter
   * sets the $scope.printer to the printer with the id passed in
   * Used for the printer well
   *
   * @param id
   * @returns {undefined}
   */
  $scope.setPrinter = function(id) {
    for (var i = 0; i < $scope.printers.length; i++) {
      if ($scope.printers[i].id === id) {
        $scope.printer = $scope.printers[i];
      }
    }
  };

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

  /*
   * Retrieving all sensors that are connected to the hub
   *  $scope.sensors {object}[]
   * Handling the promise for retrieving the sensor data and assigning that data to the associated sensor
   *  $scope.sensors.data {object}
   *  $scope.sensors.newestDatum
   */

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

}
