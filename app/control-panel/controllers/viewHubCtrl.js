app.controller('ViewHubCtrl', ViewHubCtrl);
ViewHubCtrl.$inject = ['$scope','$state','$stateParams','$q','hub','printer','sensor'];

function ViewHubCtrl($scope, $state, $stateParams,$q, hub, printer, sensor) {
  var hubId = Number($stateParams.hubId);

  var hubPromise = hub.getHub(hubId);
  var changed = false;

  $scope.printersCurrentPage = 1;
  $scope.printersItemsPerPage = 2;

  hubPromise.then(function(_hub) {
    $scope.hub = _hub;
  });


  var sensorsPromise = hub.getSensors(hubId);

  sensorsPromise.then(function(_sensors) {
    var sensorDataPromises = [];
    $scope.sensors = _sensors;

    for (var i = 0; i < $scope.sensors.length; i++) {
      sensorDataPromises.push(sensor.getData($scope.sensors[i].id));
    }

    $q.all(sensorDataPromises).then(function(_data) {
      $scope.sensorData = _data;
      console.log('Sensor Data Size: ' + $scope.sensorData.length);

      for (var j = 0; j < $scope.sensorData.length; j++) {
        $scope.sensors[j].data = $scope.sensorData[j];
        var dataLength = $scope.sensors[j].data.length;
        $scope.sensors[j].newestDatum = $scope.sensors[j].data[dataLength - 1];
        console.log('Newest Datum: ' + $scope.sensors[j].newestDatum);
      }

    });
  });

  var printersPromise = hub.getPrinters(hubId);

  printersPromise.then(function(_printers) {
    $scope.printers = _printers;
    $scope.printersTotalItems = _printers.length;
  });

  /**
   * ToHubsPage
   * Sets the state to the main hubs page, takes in a boolean if the page should refresh or not
   * @param refresh
   * @returns {}
   */
  $scope.toHubsPage = function() {
    $state.go('dashboard.hubs',{},{reload: changed});
    changed = false;
  };

  /**
   * UpdateHub
   * Updates a hub in the DB with the hub object gathered from the form
   * @param _hubId
   * @param _hub
   * @returns {undefined}
   */
  $scope.updateHub = function(_hubId, _hub) {
    console.log('Updating hub!' + _hubId);
    hub.updateHub(_hubId, _hub);
    changed = true;
  };

  $scope.pageChanged = function() {
    console.log('Printers Page changed to: ' + $scope.printersCurrentPage);
  };
}
