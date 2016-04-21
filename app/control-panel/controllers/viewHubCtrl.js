app.controller('ViewHubCtrl', ViewHubCtrl);
ViewHubCtrl.$inject = ['$scope','$state','$stateParams','$q','alert','hub','printer','sensor'];

function ViewHubCtrl($scope, $state, $stateParams,$q, alert, hub, printer, sensor) {
  var hubId = Number($stateParams.hubId);

  var hubPromise = hub.getHub(hubId);
  var sensorsPromise = hub.getSensors(hubId);
  var printersPromise = hub.getPrinters(hubId);
  var changed = false;

  $scope.printersCurrentPage = 1;
  $scope.printersItemsPerPage = 2;

  $scope.alerts = alert.get();

  /*********************************************************
   *
   * FUNCTIONS
   *
   * /

  /**
   * ToHubsPage
   * Sets the state to the main hubs page
   *  if changed = true the ListHubs controller will refresh
   * @returns {undefined}
   */
  $scope.toHubsPage = function() {
    $state.go('dashboard.listHubs',{},{reload: changed});
    changed = false;
  };

  /**
   * UpdateHub
   * Updates a hub in the DB with the hub object gathered from the form
   * @param _hubId
   * @param _hub
   * @returns {undefined}
   */
  $scope.updateHub = function(_hubId, _hub) {
    if (!$scope.updateHubForm.$valid) {
      alert.add('danger', 'Please correct the errors below and try submitting the form again.');
      return;
    }

    // Check whether form has not been filled out
    if ($scope.updateHubForm.$pristine) {
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
      updateHubPromise = hub.updateHub(_hubId, _hub);

      updateHubPromise.then(function(response) {
        if (response) {
          $scope.resetForm();
          alert.add('success', 'Hub updated successfully!');
          $state.go('dashboard.viewHub', { hubId: _hubId },{reload: true});
        } else {
          alert.add('danger', 'Sorry but this hub could not be modified.  Some values are unprocessable');
        }
      });
      return;
    }
  };


  $scope.resetForm = function() {
    $scope.hub = {};
    $scope.updateHubForm.$setPristine();
  };

  $scope.pageChanged = function() {
    console.log('Printers Page changed to: ' + $scope.printersCurrentPage);
  };

  /**
   * DeleteHub
   * calls deleteHub from the service
   * deleteHub in the service removes the hub by id
   * @param _id
   * @returns {}
   */
  $scope.deleteHub = function(_id) {
    if ($scope.user._user.admin === true) {
      hub.deleteHub(_id);
      changed = true;
      this.toHubsPage();
    } else {
      console.log('Permission Denied');
    }
  };

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
    console.log(hub.status);
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
