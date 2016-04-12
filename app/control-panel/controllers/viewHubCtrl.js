app.controller('ViewHubCtrl', ViewHubCtrl);
ViewHubCtrl.$inject = ['$scope','$state','$stateParams','hub'];

function ViewHubCtrl($scope, $state, $stateParams, hub) {
  var hubId = Number($stateParams.hubId);

  var hubPromise = hub.getHub(hubId);
  var changed = false;

  $scope.printerCurrentPage = 1;
  $scope.printerItemsPerPage = 2;


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
    $scope.printerTotalItems = _printers.length;
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

  $scope.setPage = function(pageNo) {
    $scope.printerCurrentPage = pageNo;
  };

  $scope.pageChanged = function() {
    console.log('Page changed to: ' + $scope.printerCurrentPage);
  };
}
