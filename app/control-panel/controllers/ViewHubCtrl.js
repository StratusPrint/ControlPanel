// jscs:disable

app.controller('ViewHubCtrl', ViewHubCtrl);
ViewHubCtrl.$inject = ['$rootScope', '$scope', '$state', '$stateParams', '$timeout', '$q', '$controller', '$interval', 'hub', 'printer', 'sensor'];

function ViewHubCtrl($rootScope, $scope, $state, $stateParams, $timeout, $q, $controller, $interval, hub, printer, sensor) {
  var hubId = Number($stateParams.hubId);

  $scope.sensors = {};
  $scope.updateSensorModal = {};
  $scope.updateSensorModal.form = {};
  $scope.updateSensorModal.attributes = {};
  $scope.updateSensorModalVisible = false;
  $scope.addSensorModal = {};
  $scope.addSensorModal.form = {};
  $scope.addSensorModal.attributes = {};
  $scope.addSensorModalVisible = false;
  $scope.deleteSensorModal = {};
  $scope.deleteSensorModalVisible = false;
  $scope.showDeleteModal = false; // Set to true to show the delete confirmation modal
  $scope.printersCurrentPage = 1;
  $scope.printersItemsPerPage = 2;

  $controller('AlertCtrl', { $scope: $scope });
  $controller('AlertCtrl', { $scope: $scope.updateSensorModal});
  $controller('AlertCtrl', { $scope: $scope.addSensorModal});

  /*********************************************************
   *
   * FUNCTIONS
   *
   * /

  /**
   * Modal visibility toggling
   */
  $scope.showSensorModal = function() {
    $scope.updateSensorModalVisible = true;
  };

  $scope.hideSensorModal = function() {
    $scope.updateSensorModalVisible = false;
    $scope.updateSensorModal.alerts = [];
    $scope.updateSensorModal.form.$setPristine();
  };

  $scope.showAddSensorModal = function() {
    $scope.addSensorModalVisible = true;
    $scope.addSensorModal.alerts = [];
    $scope.addSensorModal.addAlert('warning', 'All fields are required unless otherwise stated.');
  };

  $scope.hideAddSensorModal = function() {
    $scope.addSensorModalVisible = false;
    $scope.addSensorModal.alerts = [];
    $scope.addSensorModal.attributes = {};
    $scope.addSensorModal.attributes.category = 'Specify the type of sensor';
    $scope.addSensorModal.attributes.node_id = 'Specify the ID of the node that the sensor is connected to';
    $scope.addSensorModal.attributes.pin = 'Specify which GPIO pin the sensor is connected to';
  };
  $scope.showDeleteSensorModal = function() {
    $scope.deleteSensorModalVisible = true;
  };

  $scope.hideDeleteSensorModal = function() {
    $scope.deleteSensorModalVisible = false;
  };

  /**
   * Add a sensor
   */
  $scope.addSensor = function(attributes) {
    // Check whether form has not been filled out
    if ($scope.addSensorModal.form.$pristine) {
      $scope.addSensorModal.addAlert('warning', 'Please fill out the form below before submitting.');
      return;
    }

    // Check whether any validation errors are present on the form
    if (!$scope.addSensorModal.form.$valid) {
      $scope.addSensorModal.addAlert('danger', 'Please correct the errors below and try submitting the form again.');
      return;
    }

    hub.addSensor($stateParams.hubId, attributes)
      .success(function(response) {
        $scope.hideAddSensorModal();
        $scope.getSensors();
      })
      .error(function(response) {
        $scope.addSensorModal.addAlert('danger', 'Unable to add sensor. Please double check that the specified name is not already in use by another sensor and then try again.');
        console.log('Unable to add sensor to hub.');
        console.log(response);
      });
  };

  /**
   * Update a sensor
   */
  $scope.updateSensor = function(sensorId, attributes) {
    // Check whether form has not been filled out
    if ($scope.updateSensorModal.form.$pristine) {
      $scope.updateSensorModal.addAlert('warning', 'Please fill out the form below before submitting.');
      return;
    }
    
    // Check whether any validation errors are present on the form
    if (!$scope.updateSensorModal.form.$valid) {
      $scope.updateSensorModal.addAlert('danger', 'Please correct the errors below and try submitting the form again.');
      return;
    }

    hub.updateSensor(sensorId, attributes)
      .success(function(response) {
        $scope.updateSensorModal.addAlert('success', 'The sensor has been updated successfully.');
        angular.forEach(attributes, function(attribute, key){
            if(attribute) {
              $scope.updateSensorModal.sensor[key] = attribute;
            } 
        });
        $scope.updateSensorModal.attributes = {};
        $scope.updateSensorModal.form.$setPristine();
        $scope.getSensors();
      })
      .error(function(response) {
          $scope.updateSensorModal.addAlert('danger', 'Unable to update sensor. Please double check that the specified name is not already in use by another sensor, and that the high threshold is greater than the low threshold.');
          console.log(response);
      });
  };

  /**
   * Delete a sensor
   */
  $scope.deleteSensor = function(sensorId) {
    hub.deleteSensor(sensorId)
      .then(function(response) {
        $scope.hideDeleteSensorModal();
        $scope.getSensors();
      });
  };

  /**
   * ToHubsPage
   * Waits 500 milliseconds for the animation to fade
   * Sets the state to the main hubs page
   * @param {boolean} reload
   *  if reload = true the ListHubs controller will refresh
   * @returns {undefined}
   */
  $scope.toHubsPage = function(reload) {
    $timeout(function() {
      $state.go('dashboard.listHubs',{},{reload: reload});
    },500);
  };

  /**
   * UpdateHub
   * Updates a hub in the DB with the hub object gathered from the form
   * Performs multiple checks on the form, check if there are no warnings
   *  checks if the form is empty or not
   *  Checks if the user is an admin, incase they edit some htlm and get the form to show
   * If all checks clear, then it updates the hub, if the entity is invalid it will add the alert to tell the user
   *
   * @param _hubId
   * @param _hub
   * @returns {undefined}
   */
  $scope.updateHub = function(_hubId, _hub) {
    if (!$scope.updateHubForm.$valid) {
      $scope.addAlert('danger', 'Please correct the errors below and try submitting the form again.');
      return;
    }

    // Check whether form has not been filled out
    if ($scope.updateHubForm.$pristine) {
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
      updateHubPromise = hub.updateHub(_hubId, _hub);

      updateHubPromise.then(function(data) {
        if (typeof (data) === 'object') {
          $scope.resetForm();
          $scope.addAlert('success', 'Hub updated successfully.');
          $scope.hub = data;
          $rootScope.$broadcast('hub:updated');
        } else {
          $scope.addAlert('danger', 'Sorry but this hub could not be modified.  Some values are unprocessable.');
        }
      });
      return;
    }
  };


  /**
   * ResetForm
   * clears the $scope.hub and sets the form to pristine(cleared)
   *
   * @returns {undefined}
   */
  $scope.resetForm = function() {
    $scope.hubDetails = {};
    $scope.updateHubForm.$setPristine();
  };


  /**
   * DeleteHub
   * calls deleteHub from the service
   * deleteHub in the service removes the hub by id
   * @param _id
   * @returns {}
   */
  $scope.deleteHub = function(_id) {
    $scope.showDeleteModal = false;
    if ($scope.user._user.admin === true) {
      hub.deleteHub(_id);
      this.toHubsPage(true);
      console.log($scope.showDeleteModal);
    } else {
      console.log('Permission Denied');
    }
  };

  /**
   * DeleteModal
   * Called by the delete button
   * makes the deleteModal visible
   *
   * @returns {undefined}
   */
  $scope.deleteModal = function() {
    console.log('DeleteModal firing');
    $scope.showDeleteModal = !$scope.showDeleteModal;
  };

  /**
   * GenerateApiKey
   * calls generateApiKey from the service
   * generateApiKey in the service generates a new hub API key
   * @param _id
   * @returns a new hub api key
   */
  $scope.generateApiKey = function(_id) {
    if ($scope.user._user.admin === true) {
      hub.generateApiKey(_id).then(function(resp) {
        console.log(resp);
        $scope.apiKey = resp.api_key;
      });
    } else {
      console.log('Permission Denied');
    }
  };

  /**
   * ViewPrinter
   * Sets the state to that of the printer with the associated _printerId
   *
   * @param _printerId
   * @returns {undefined}
   */
  $scope.viewPrinter = function(_printerId) {
    $state.go('dashboard.printer', {hubId: hubId, printerId: _printerId});
  };

  $scope.getSensors = function() {
    hub.getSensors(hubId)
      .success(function(response) {
        $scope.sensors = response;
      })
      .error(function(response) {
        console.log('Unable to retrieve a list of sensors.');
        console.log(response);
      });
  };

  $scope.getPrinters = function() {
    hub.getPrinters(hubId)
      .then(function(_printers) {
        $scope.printers = _printers;
        $scope.printersTotalItems = _printers.length;
      });
  };

  $scope.getHub = function() {
    hub.getHub(hubId)
    .then(function(_hub) {
      $scope.hub = _hub;
    });
  };

  $scope.refresh = function() {
    $scope.getPrinters();
    $scope.getSensors();
    $scope.getHub();
  };

  $scope.refresh();

  var timerPromise;
  $scope.timer = function() {
    timerPromise = $interval($scope.refresh, 2000);
  };

  $scope.timer();

  $scope.$on('$destroy',function(){
      if(timerPromise) {
          $interval.cancel(timerPromise);   
      }
  });

}
