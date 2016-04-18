app.controller('ListHubsCtrl', ListHubsCtrl);

ListHubsCtrl.$inject = ['$scope','$state','$stateParams','hub'];

function ListHubsCtrl($scope,$state,$stateParams,hub) {

  var hubsPromise = hub.getAllHubs();

  hubsPromise.then(function(hubs) {
    $scope.hubs = hubs;
  });

  /**
   * AddHub
   * Calls addHub in the hubs service
   * addHub in the service adds a hub to the DB
   * @param _hub
   * @returns {}
   */
  $scope.addHub = function(_hub) {
    console.log('Adding Hub ' + _hub);
    hub.addHub(_hub);
    this.toHubsPage(true);
  };

  /**
   * GetHub
   * Retrieves the hub from the hubs JSON array
   * @param _id
   * @returns {JSON} if hub is found else returns {NUMBER} 0
   */
  $scope.getHub = function(_id) {
    console.log('Fetching hub#: ' + _id);
    for (var i = 0; i < $scope.hubs.length; i++) {
      if ($scope.hubs[i].id === _id) {
        console.log('Returning hub: ' + $scope.hubs[i].id);
        return $scope.hubs[i];
      }
    }
    return 0;
  };

  /**
   * ViewDetails
   * Sets the current hub selected to the id passed in
   * Changes the view to the current hubs page
   * @param _hubId
   * @returns {}
   */
  $scope.viewDetails = function(_hubId) {
    $scope.currentHub = this.getHub(_hubId);
    console.log('Current hub: ' + $scope.currentHub.id);
    $state.go('dashboard.viewHub', { hubId: _hubId });
  };

}
