// jscs:disable

app.controller('ViewHubCtrl', ViewHubCtrl);
ViewHubCtrl.$inject = ['$scope', '$state', '$stateParams', '$timeout', '$q', '$controller', 'hub', 'printer', 'sensor'];

function ViewHubCtrl($scope, $state, $stateParams, $timeout, $q, $controller, hub, printer, sensor) {
  var hubId = Number($stateParams.hubId);

  var hubPromise = hub.getHub(hubId);
  var sensorsPromise = hub.getSensors(hubId);
  var printersPromise = hub.getPrinters(hubId);

  $scope.updateSensorModal = {};
  $scope.updateSensorModal.form = {};
  $scope.updateSensorModal.attributes = {};
  $scope.updateSensorModalVisible = false;
  $scope.showDeleteModal = false; // Set to true to show the delete confirmation modal
  $scope.printersCurrentPage = 1;
  $scope.printersItemsPerPage = 2;

  $controller('AlertCtrl', { $scope: $scope });
  $controller('AlertCtrl', { $scope: $scope.updateSensorModal});

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
  };

  /**
   * Update a sensor
   */
  $scope.updateSensor = function(sensorId, attributes) {
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
      })
      .error(function(response) {
          $scope.updateSensorModal.addAlert('danger', 'Unable to update sensor. Please double check that the specified name is not already in use by another sensor.');
          console.log(response);
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
          $scope.addAlert('success', 'Hub updated successfully!');
          $scope.hub = data;
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
    console.log('Firing?');
    $scope.showDeleteModal = false;
    if ($scope.user._user.admin === true) {
      // Hub.deleteHub(_id);
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
   * Sets the state to that of the printer with the associated _id
   *
   * @param _id
   * @returns {undefined}
   */
  $scope.viewPrinter = function(_id) {
    $state.go('dashboard.printer', {hubId: hubId, printerId: _id });
  };


  /*********************************************************
   *
   * Promise handling
   * Setting scope variables
   *
   * /


  /*
   * Handling the promise and
   * Retrieving the proper hub
   *  $scope.hub
   */
  hubPromise.then(function(_hub) {
    $scope.hub = _hub;
  });


  /*
   * Retrieving all sensors that are connected to the hub
   *  $scope.sensors {object}[]
   * Handling the promise for retrieving the sensor data and assigning that data to the associated sensor
   *  $scope.sensors.data {object}
   *  $scope.sensors.newestDatum
   */
  sensorsPromise.then(function(_sensors) {
    var sensorDataPromises = [];
    $scope.sensors = _sensors;

    for (var i = 0; i < $scope.sensors.length; i++) {
      sensorDataPromises.push(sensor.getData($scope.sensors[i].id));
    }

    $q.all(sensorDataPromises).then(function(_data) {
      var sensorData = _data;
      console.log('Sensor Data Size: ' + sensorData.length);

      for (var j = 0; j < sensorData.length; j++) {
        $scope.sensors[j].data = sensorData[j];
        var dataLength = $scope.sensors[j].data.length;
        $scope.sensors[j].newestDatum = $scope.sensors[j].data[dataLength - 1];
        if ($scope.sensors[j].data[dataLength - 1].value === '1' || $scope.sensors[j].data[dataLength - 1].value === '0') {
          if ($scope.sensors[j].data[dataLength - 1].value === '1') {
            $scope.sensors[j].newestDatum.value = 'True';
          } else {
            $scope.sensors[j].newestDatum.value = 'False';
          }
        }else {
          $scope.sensors[j].newestDatum.value = parseFloat($scope.sensors[j].data[dataLength - 1].value).toFixed(2);
        }
      }

    });
  });

  /*
   * Retrieving all printers connected to the hub
   *  $scope.printers {object}[]
   */
  printersPromise.then(function(_printers) {
    $scope.printers = _printers;
    $scope.printersTotalItems = _printers.length;
  });
}
