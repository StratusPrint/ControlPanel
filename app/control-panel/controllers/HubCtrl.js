app.controller('HubCtrl', HubCtrl);

HubCtrl.$inject = ['$scope','hub'];

function HubCtrl($scope,hub) {
  $scope.hubs = hub.getAllHubs();
  console.log($scope.hubs);

  $scope.addHub = function(hub) {
    hub.addHub(hub);
  };

}
