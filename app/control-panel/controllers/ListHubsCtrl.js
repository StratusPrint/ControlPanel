app.controller('ListHubsCtrl', ListHubsCtrl);

ListHubsCtrl.$inject = ['$scope', '$state', '$stateParams', '$controller','$compile','DTOptionsBuilder', 'DTColumnBuilder', 'hub'];

function ListHubsCtrl($scope, $state, $stateParams, $controller, $compile, DTOptionsBuilder, DTColumnBuilder, hub) {
  // Inject alert controller scope
  $controller('AlertCtrl', { $scope: $scope });
  var vm = this;

  vm.dtOptions = DTOptionsBuilder.fromFnPromise(function() {
    return hub.getAllHubs();
  })
  .withPaginationType('full_numbers')
  .withOption('createdRow',createdRow);

  vm.cols = [
    DTColumnBuilder.newColumn('status').withTitle('Status'),
    DTColumnBuilder.newColumn('id').withTitle('Id'),
    DTColumnBuilder.newColumn('friendly_id').withTitle('Friendly Id'),
    DTColumnBuilder.newColumn('location').withTitle('Location'),
    DTColumnBuilder.newColumn('hostname').withTitle('Hostname'),
    DTColumnBuilder.newColumn('desc').withTitle('Description'),
    DTColumnBuilder.newColumn(null).withTitle('Actions').notSortable().renderWith(actionsHtml),
  ];
  vm.newPromise = getNewPromise;
  vm.reloadData = reloadData;
  vm.changeData = changeData;
  vm.dtInstance = {};

  function getNewPromise() {
    console.log('Fired');
    return hub.getAllHubs();
  }
  function actionsHtml(data, type, full, meta) {
    return '<button class="btn btn-primary" ng-click="viewDetails(' + data.id + ')">View Details</button>';
  }
  function createdRow(row, data, dataIndex) {
    // Recompiling so we can bind Angular directive to the DT
    $compile(angular.element(row).contents())($scope);
  }

  function reloadData() {
    console.log('fireing');
    var resetPaging = true;
    var hubsPromise = hub.getAllHubs();

    hubsPromise.then(function(response) {
      vm.dtInstance.reloadData(response, resetPaging);
    });
  }

  function callback(json) {
    console.log(json);
  }

  function changeData() {
    vm.dtInstance.changeData(function() {
      return hub.getAllHubs();
    });
  }

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
   * Adds a hub in the DB with the hub object gathered from the form
   * Performs multiple checks on the form, check if there are no warnings
   *  checks if the form is empty or not
   *  Checks if the user is an admin, incase they edit some htlm and get the form to show
   * If all checks clear, then it adds the hub, if the entity is invalid it will add the alert to tell the user
   * @param _hub
   * @returns {}
   */
  $scope.addHub = function(_hub) {
    if (!$scope.addHubForm.$valid) {
      $scope.addAlert('danger', 'Please correct the errors below and try submitting the form again.');
      return;
    }

    // Check whether form has not been filled out
    if ($scope.addHubForm.$pristine) {
      $scope.addAlert('warning', 'Please fill out the form below before saving.');
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

      addHubPromise.then(function(data) {
        if (typeof (data) === 'object') {
          $scope.hubs.push(data);
          $scope.resetForm();
          $scope.addAlert('success', 'The hub was successfully added');
          // Vm.reloadData();
        } else {
          $scope.addAlert('danger', 'Sorry but this hub could not be added.  Some values are unprocessable');
        }
      });
      return;
    }
    $scope.addAlert('warning', 'Sorry, but you are not an admin.');
  };

  /**
   * ResetForm
   * clears the $scope.hub and sets the form to pristine(cleared)
   *
   * @returns {undefined}
   */
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
