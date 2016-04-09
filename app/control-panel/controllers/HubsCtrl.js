app.controller('HubsCtrl', HubsCtrl);

HubsCtrl.$inject = ['$scope','$state','$stateParams','hub'];

function HubsCtrl($scope,$state,$stateParams,hub) {


  var hubsPromise = hub.getAllHubs();

  hubsPromise.then(function(hubs) {
    $scope.hubs = hubs;
  });


  $scope.addHub = function(_hub) {
    console.log('In Ctrl ' + _hub);
    hub.addHub(_hub);
  };

  $scope.deleteHub = function(_id) {
    hub.deleteHub(_id);
  };

  $scope.viewDetails = function(_hubId) {
    $state.go('dashboard.hubs.hubId', { hubId: _hubId }, {reload: true});
  };
}
