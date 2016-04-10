app.controller('HubDetailsCtrl', HubDetailsCtrl);
HubDetailsCtrl.$inject = ['$scope','$state','$stateParams','hub'];

function HubDetailsCtrl($scope, $state, $stateParams, hub) {
  console.log('Params: ' + $stateParams.hubId);
  console.log('Params: ' + JSON.stringify($stateParams));

  var hubPromise = hub.getHub($stateParams.hubId);

  hubPromise.then(function(_hub) {
    $scope.currentHub = _hub;
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

}
