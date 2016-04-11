app.controller('ViewHubCtrl', ViewHubCtrl);
ViewHubCtrl.$inject = ['$scope','$state','$stateParams','hub'];

function ViewHubCtrl($scope, $state, $stateParams, hub) {
  console.log('Params: ' + $stateParams.hubId);
  console.log('Params: ' + JSON.stringify($stateParams));

  var hubId = Number($stateParams.hubId);
  console.log('Hub id is: ' + hubId + 'And it\'s type is: ' + typeof (hubId));

  var hubPromise = hub.getHub(hubId);
  var changed = false;

  hubPromise.then(function(_hub) {
    $scope.hub = _hub;
  });

  var sensorsPromise = hub.getSensors(hubId);

  sensorsPromise.then(function(_sensors) {
    $scope.sensors = _sensors;
  });

  var printersPromise = hub.getPrinters(hubId);

  printersPromise.then(function(_printers) {
    $scope.printers = _printers;
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

  $scope.updateHub = function(_hubId, _hub) {
    console.log('Updating hub!' + _hubId);
    hub.updateHub(_hubId, _hub);
    changed = true;
  };

}
