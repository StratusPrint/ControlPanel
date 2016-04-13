app.controller('NavCtrl', NavCtrl);

NavCtrl.$inject = ['$scope', '$state', '$stateParams', 'hub'];

function NavCtrl($scope, $state, $stateParams, hub) {
  var promise = hub.getAllHubs();

  promise.then(function(_hubs) {
    $scope.hubs = _hubs;
  });

  $scope.viewHub = function(_hubId) {
    $state.go('dashboard.hubs.hubId', { hubId: _hubId });
  };
}
