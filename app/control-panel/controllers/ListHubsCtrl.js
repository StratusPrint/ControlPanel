app.controller('ListHubsCtrl', ListHubsCtrl);

ListHubsCtrl.$inject = ['$scope','$state','$stateParams','alert','hub'];

function ListHubsCtrl($scope,$state,$stateParams,alert,hub) {
  $scope.alerts = alert.get();

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
    $state.go('dashboard.listHubs',{},{reload: refresh});
  };

  /**
   * AddHub
   * Calls addHub in the hubs service
   * addHub in the service adds a hub to the DB
   * @param _hub
   * @returns {}
   */
  $scope.addHub = function(_hub) {
    if (!$scope.addHubForm.$valid) {
      alert.add('danger', 'Please correct the errors below and try submitting the form again.');
      return;
    }

    // Check whether form has not been filled out
    if ($scope.addHubForm.$pristine) {
      alert.add('warning', 'Please fill out the form below before saving.');
      return;
    }

    // Remove empty fields from profile to prevent errors
    Object.keys($scope.hub).forEach(function(key) {
      if ($scope.hub[key] === '') {
        delete $scope.hub[key];
      }
    });

    if ($scope.user.isAdmin()) {
      addHubPromise = hub.addHub(_hub);
      addHubPromise.then(function(response) {
        console.log('output bruh: ' + response);
        if (response) {
          $scope.resetForm();
          this.toHubsPage(true);
        } else {
          alert.add('danger', 'Sorry but this hub could not be added.  Some values are unprocessable');
        }
      });
      return;
    }
    alert.add('warning', 'Sorry, but you are not an admin.');
  };

  $scope.resetForm = function() {
    $scope.hub = {};
    $scope.addHubForm.$setPristine();
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
