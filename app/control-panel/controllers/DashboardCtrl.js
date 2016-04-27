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

    // Execute all promises
    $q.all(sensorDataPromises).then(function(_data) {
      var sensorData = _data;
      var tempSensors = [];
      var humidSensors = [];

      for (var j = 0; j < sensorData.length; j++) {
        // Bind to a variable in the sensor itself
        $scope.sensors[j].data = sensorData[j];
        if ($scope.sensors[j].category === 'temperature') {
          // $scope.sensors[j].data = truncateData($scope.sensors[j].data);
          // $scope.sensors[j] = truncateData($scope.sensors[j]);
          truncateData($scope.sensors[j]);

          // Console.log($scope.sensors[j].data);
          // TempSensor.push($scope.sensors[j]);
          // PopulateTempGraph($scope.sensors[j]);
          // Populate temperature data for graph

        } else if ($scope.sensors[j].category === 'humidity') {
          // Populate humidity graph
        }
      }
    });
  });

  /********************************************************
   * Local functions
   */
  function truncateData(_sensor) {
    for (var i; i < _sensor.data.length; i++) {
      // _sensor.data[i].value = parseFloat(_sensor.data[i].value.toFixed(2));
      _sensor.data[i].value = 5;
      console.log('Truncated data ' + _sensor.data[i].value);
    }
    console.log('Truncated');
    console.log(_sensor.data);
  }

}
