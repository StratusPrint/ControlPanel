app.controller('HubsCtrl', HubsCtrl);

HubsCtrl.$inject = ['$scope','$state','$stateParams','hub'];

function HubsCtrl($scope,$state,$stateParams,hub) {

  var hubsPromise = hub.getAllHubs();

  hubsPromise.then(function(hubs) {
    $scope.hubs = hubs;
  });

  /**
   * ToHubsPage
   * Sets the state to the main hubs page, takes in a boolean if the page should refresh or not
   * @param refresh
   * @returns {}
   */
  $scope.toHubsPage = function(refresh) {
    $state.go('dashboard.hubs',{},{reload: refresh});
  };

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
   * DeleteHub
   * calls deleteHub from the service
   * deleteHub in the service removes the hub by id
   * @param _id
   * @returns {}
   */
  $scope.deleteHub = function(_id) {
    console.log('Deleting Hub ' + _id);
    hub.deleteHub(_id);
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
    $state.go('dashboard.hubs.hubId', { hubId: _hubId });
  };

}
