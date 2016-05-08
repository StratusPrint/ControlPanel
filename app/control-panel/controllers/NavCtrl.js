// jscs:disable

app.controller('NavCtrl', NavCtrl);

NavCtrl.$inject = ['$scope', '$state', '$stateParams', '$controller', 'hub'];

function NavCtrl($scope, $state, $stateParams, $controller, hub) {
  $scope.getHubs = function() {
  	hub.getAllHubs()
  		.then(function(data) {
  			$scope.hubs = data;
  		});
  };

  $scope.viewHub = function(_hubId) {
    $state.go('dashboard.hubs.hubId', { hubId: _hubId });
  };

  $scope.$on('hub:updated', function(event) {
    $scope.getHubs();
  });

  $scope.getHubs();
}
