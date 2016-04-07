app.controller('HubCtrl', HubCtrl);

HubCtrl.$inject = ['$scope','hub'];

function HubCtrl($scope,hub) {
  var hubsPromise = hub.getAllHubs();

  hubsPromise.then(function(hubs) {
    $scope.hubs = hubs;
  });

  $scope.addHub = function(_hub) {
    console.log('In Ctrl ' + _hub);
    hub.addHub(_hub);
  };
}
