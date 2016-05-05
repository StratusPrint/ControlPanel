app.controller('DashboardCtrl', DashboardCtrl);

DashboardCtrl.$inject = ['$scope', '$state', '$q', 'hub', 'printer', 'sensor'];

function DashboardCtrl($scope, $state, $q, hub,  printer, sensor) {
  var defaultHubId = $scope.user._user.default_hub_id;

  $scope.currentHub = {};
  $scope.hubs = {};
  $scope.stats = {};
  $scope.printers = {};
  $scope.printer = {};
  $scope.sensors = {};

  $scope.lineChartdata = [
  ];
  /********************************************************
   * Promise Handling methods
   * Fetchs everything from the API, sets all variables
   */

  /**
   * setAllData
   * sets all scope variables by calling their associated functions
   *
   * Variables Set
   *  $scope.currentHub
   *  $scope.hubs
   *  $scope.stats
   *  $scope.printers
   *  $scope.printer
   *  $scope.printer.currentJob
   *  $scope.sensors
   *  $scope.sensors.data
   *
   * @param _hubId
   * @returns {undefined}
   */
  $scope.setAllData = function(_hubId) {
    $scope.setCurrentHub(_hubId);
    $scope.setAllHubs();
    $scope.setStats(_hubId);
    $scope.setPrinters(_hubId);
    $scope.setSensors(_hubId);
  };

  /**
   * setCurrentHub
   * $scope.currentHub = the hub retrieved by _hubId
   *
   * @param {number} _hubId
   * @returns {undefined}
   */
  $scope.setCurrentHub = function(_hubId) {
    var defaultHubPromise = hub.getHub(_hubId);
    defaultHubPromise.then(function(_hub) {
      $scope.currentHub = _hub;
      if (_hub.status === 404) {
        $scope.showNoDefaultHubAlert = true;
      } else {
        $scope.showNoDefaultHubAlert = false;
      }
    });
  };

  /**
   * setAllHubs
   * $scope.hubs = all hubs in the DB
   *
   * @returns {undefined}
   */
  $scope.setAllHubs = function() {
    var hubsPromise = hub.getAllHubs();
    hubsPromise.then(function(_hubs) {
      $scope.hubs = _hubs;
      if (!_hubs.length) {
        $scope.showWizard = true;
      } else {
        $scope.showWizard = false;
      }
    });
  };

  /**
   * setStats
   * $scope.stats = statistics retrieved from the hub
   *
   * @param {number} _hubId
   * @returns {undefined}
   */
  $scope.setStats = function(_hubId) {
    var statsPromise = hub.getStatistics(_hubId);
    statsPromise.then(function(_stats) {
      $scope.stats = _stats;
    });
  };

  /**
   * setPrinters
   * $scope.printers = printers retrieved from the hub id
   * $scope.printer = first printer in the array
   *
   * @param {number} _hubId
   * @returns {undefined}
   */
  $scope.setPrinters = function(_hubId) {
    var printersPromise = hub.getPrinters(_hubId);
    printersPromise .then(function(_printers) {
      var currentJobsPromise = [];
      $scope.printers = _printers;
      $scope.printer = $scope.printers[0];
    });
  };

  /**
   * setPrinter
   * $scope.printer = the printer with the id passed in
   * calls $scope.setCurrentJob($scope.printer.id)
   *
   * @param {number} _printerId
   * @returns {undefined}
   */
  $scope.setPrinter = function(_printerId) {
    for (var i = 0; i < $scope.printers.length; i++) {
      if ($scope.printers[i].id === _printerId) {
        $scope.printer = $scope.printers[i];
        $scope.setCurrentJob($scope.printer.id);
      }
    }
  };

  /**
   * setCurrentJob
   * $scope.printer.currentJob = current job of the printer
   *
   * @param _printerId
   * @returns {undefined}
   */
  $scope.setCurrentJob = function(_printerId) {
    printer.getCurrentJob(_printerId)
    .success(function(response) {
      $scope.printer.currentJob = response;
    })
    .error(function(response) {
      console.log('Unable to retrieve current job.');
      console.log(response);
    });
  };

  /**
   * setSensors
   *
   * Retrieving all sensors that are connected to the hub
   * $scope.sensors = sensors attached to the a hub
   *
   * Handling the promise for retrieving the sensor data and assigning that data to the associated sensor
   *
   * $scope.sensors.data = data associated with each sensor
   * $scope.sensors.newestDatum
   *
   * @param {number} _hubId
   * @returns {undefined}
   */
  $scope.setSensors = function(_hubId) {
    var sensorsPromise = hub.getSensors(_hubId);
    sensorsPromise.then(function(_sensors) {
      var sensorDataPromises = [];
      $scope.sensors = _sensors.data;

      for (var i = 0; i < $scope.sensors.length; i++) {
        sensorDataPromises.push(sensor.getData($scope.sensors[i].id, 1));
      }

      // Execute all promises
      $q.all(sensorDataPromises).then(function(_data) {
        var sensorData = _data;
        var tempSensors = [];
        var humidSensors = [];

        for (var j = 0; j < sensorData.length; j++) {
          $scope.sensors[j].data = sensorData[j];
          if ($scope.sensors[j].category === 'temperature' && $scope.sensors[j].data.length > 0) {
            console.log('Pushing');
            tempSensors.push($scope.sensors[j]);
          } else if ($scope.sensors[j].category === 'humidity' && $scope.sensors[j].data.length > 0) {
            humidSensors.push($scope.sensors[j]);
          }
        }
        setTempChartDatum(tempSensors);
        setHumidChartDatum(humidSensors);
      });
    });
  };

  $scope.setAllData(defaultHubId);

  /*******************************************************
   * Functions
   */

  /**
   * ViewPrinter
   * Sets the state to that of the printer with the associated _printerId
   *
   * @param _printerId
   * @returns {undefined}
   */
  $scope.viewPrinter = function(_printerId) {
    $state.go('dashboard.printer', {hubId: $scope.currentHub.id, printerId: _printerId });
  };

  /********************************************************
   * Chart Data
   */


  var setTempChartDatum = function(_sensors) {
    calcAverageDatum(_sensors);
    var chartDatum = [
    ];

    for (var i = 0; i < _sensors.length; i++) {
      sensorChartDatum = [];
      for (var j = 0; j < _sensors[i].data.length; j++) {
        _sensors[i].data[j].value = parseFloat(_sensors[i].data[j].value).toFixed(2);
        var chartData = {};
        chartData.y = _sensors[i].data[j].created_at;
        chartData.a = _sensors[i].data[j].value;
        sensorChartDatum.push(chartData);
      }
      chartDatum.push(sensorChartDatum);
    }
    $scope.tempChartData = chartDatum;
    console.log($scope.tempChartData.length);
  };

  var setHumidChartDatum = function(_sensors) {
    var chartDatum = [
    ];

    for (var i = 0; i < _sensors.length; i++) {
      sensorChartDatum = [];
      for (var j = 0; j < _sensors[i].data.length; j++) {
        _sensors[i].data[j].value = parseFloat(_sensors[i].data[j].value).toFixed(2);
        var chartData = {};
        chartData.y = _sensors[i].data[j].created_at;
        chartData.a = _sensors[i].data[j].value;
        sensorChartDatum.push(chartData);
      }
      chartDatum.push(sensorChartDatum);
    }
    $scope.humidChartData = chartDatum;
  };
  /********************************************************
   * Local functions
   */

  /**
   * calcMaxDataLength
   *
   * Calculates the max length of the data contained in an array of sensors
   *
   * @param {JSON[]} _sensors
   * @returns {number}
   */
  calcMaxDataLength = function(_sensors) {
    var lengths = [];
    for (var i = 0; i < _sensors.length; i++) {
      lengths.push(_sensors[i].data.length);
    }
    return Math.max.apply(Math,lengths);
  };

  /**
   * calcAverageDatum
   *
   * Calculates the average datum for a set of sensors
   * Returns a single array that contains the average value
   *  for each index of the data provided by the set of sensors
   *
   * @param {{JSON[]}} _sensors
   * @returns {number[]}
   */
  var calcAverageDatum = function(_sensors) {
    var start = performance.now();
    var maxDataLength = calcMaxDataLength(_sensors);
    console.log('max length: ' + maxDataLength);
    var avgDatum = [];
    var numSensors = _sensors.length;

    for (var i = 0; i < maxDataLength; i++) {
      var avgData = 0;

      for (j = 0; j < _sensors.length; j++) {
        if (i < _sensors[j].data.length) {
          avgData += parseFloat(_sensors[j].data[i].value);
        }
      }
      avgData = avgData / _sensors.length;
      avgData = parseFloat(avgData).toFixed(2);
      avgDatum.push(avgData);
    }
    var end = performance.now();
    console.log('Total Time Taken: ' + (end - start));
    return avgDatum;
  };

}
