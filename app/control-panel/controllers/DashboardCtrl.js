app.controller('DashboardCtrl', DashboardCtrl);

DashboardCtrl.$inject = ['$scope', '$q', 'hub', 'printer', 'sensor'];

function DashboardCtrl($scope, $q, hub,  printer, sensor) {
  $scope.printer = {};
  var defaultHubId = $scope.user._user.default_hub_id;
  console.log('using hub: ' + defaultHubId);


  $scope.chartData = [
    {label: 'Download Sales', value: 12},
    {label: 'In-Store Sales', value: 30},
    {label: 'Mail-Order Sales', value: 20},
  ];
  $scope.chartColors = ['#31C0BE', '#c7254e', '#98a0d3'];
  $scope.myFormatter = function(input) {
    return input + '%';
  };

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
        $scope.getCurrentJob();
      }
    }
  };

  $scope.getCurrentJob = function() {
    printer.getCurrentJob($scope.printer.id)
    .success(function(response) {
      $scope.printer.currentJob = response;
    })
    .error(function(response) {
      console.log('Unable to retrieve current job.');
      console.log(response);
    });
  };

  /********************************************************
   * Promise Handling
   * Fetching all objects
   */
  var defaultHubPromise = hub.getHub(defaultHubId);
  defaultHubPromise.then(function(_hub) {
    $scope.hub = _hub;
  });

  var statsPromise = hub.getStatistics(defaultHubId);
  statsPromise.then(function(_stats) {
    $scope.stats = _stats;
  });

  var printersPromise = hub.getPrinters(defaultHubId);
  printersPromise .then(function(_printers) {
    var currentJobsPromise = [];
    $scope.printers = _printers;
    $scope.printer = $scope.printers[0];
    $scope.getCurrentJob($scope.printer.id);
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
        } else {
          $scope.sensors[j].newestDatum.value = parseFloat($scope.sensors[j].data[dataLength - 1].value).toFixed(2);
        }
      }
    });
  });

}
