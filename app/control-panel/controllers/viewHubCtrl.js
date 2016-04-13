app.controller('ViewHubCtrl', ViewHubCtrl);
ViewHubCtrl.$inject = ['$scope','$state','$stateParams','hub','printer','sensor'];

function ViewHubCtrl($scope, $state, $stateParams, hub, printer, sensor) {
  var hubId = Number($stateParams.hubId);

  var hubPromise = hub.getHub(hubId);
  var changed = false;

  $scope.printersCurrentPage = 1;
  $scope.printersItemsPerPage = 2;

  $scope.sensorsCurrentPage = 1;
  $scope.sensorsItemsPerPage = 4;

  hubPromise.then(function(_hub) {
    $scope.hub = _hub;
  });

  var sensorsPromise = hub.getSensors(hubId);

  sensorsPromise.then(function(_sensors) {
    $scope.sensors = _sensors;
    $scope.sensorsTotalItems = _sensors.length;
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

  $scope.pageChanged = function(object) {
    if (object === $scope.printers) {
      console.log('Printers Page changed to: ' + $scope.printersCurrentPage);
    } else if (object === $scope.sensors) {
      console.log('Sensors Page changed to: ' + $scope.sensorsCurrentPage);
    }
  };
}
