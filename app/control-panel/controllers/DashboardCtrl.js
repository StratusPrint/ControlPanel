app.controller('DashboardCtrl', DashboardCtrl);

DashboardCtrl.$inject = ['$scope', 'hub', 'printer', 'sensor'];

function DashboardCtrl($scope, hub, printer, sensor) {
  $scope.message = 'Welcome to the Dashboard!';
  console.log('Default Hub: ' + $scope.user._user.default_hub_id);
  console.log('Fetching Hub id 27');
  // Var defaultHubPromise = hub.getHub($scope.user._user.default_hub_id);
  var defaultHubPromise = hub.getHub(27);

  defaultHubPromise.then(function(response) {
    $scope.hub = response;
    console.log(JSON.stringify($scope.hub));
  });
}
