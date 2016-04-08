app.controller('HubCtrl', HubCtrl);

HubCtrl.$inject = ['$scope','hub'];

function HubCtrl($scope,hub) {
  /*
  Var hubsPromise = hub.getAllHubs();

  hubsPromise.then(function(hubs) {
    $scope.hubs = hubs;
  });
  */
  $scope.hubs = hub.getAllHubs();
  console.log('In ctrl ' + $scope.hubs);

  $scope.addHub = function(_hub) {
    console.log('In Ctrl ' + _hub);
    hub.addHub(_hub);
  };

  $scope.deleteHub = function(_id) {
    hub.deleteHub(_id);
  };
}
