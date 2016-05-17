app.service('hub', HubService);

HubService.$inject = ['$http', '$state', 'user'];

function HubService($http, $state, user) {
  /**
   * GetAllHubs
   * Fetches every hub from the database
   *
   * @returns {promise}
   */
  this.getAllHubs = function() {
    return $http({
      method: 'GET',
      url: 'https://dev.api.stratusprint.com/v1/hubs',
    });
  };

  /**
   * AddHub
   * Takes in a hub object that consists of a friendly_id, ip, hostname, location, and desc
   * All of type string
   *
   * @param hub
   * @returns {$q} promise if it succeeds
   * @returns {boolean} if it fails
   */
  this.addHub = function(hub) {
    return $http({
      method: 'POST',
      url: 'https://dev.api.stratusprint.com/v1/hubs',
      data: {hub: hub},
    }).then(function successCallback(response) {
      return response.data;

    }, function errorCallback(response) {
      console.log('Failed to add hub');
      console.log(JSON.stringify(response));
      return false;
    });
  };

  /**
   * GenerateApiKey
   * Generates a new hub API key that can be used for authentication
   *
   * @param _hubId
   * @returns {$q} promise if it succeeds
   * @returns {boolean} if it fails
   */
  this.generateApiKey = function(_hubId) {
    return $http({
      method: 'POST',
      url: 'https://dev.api.stratusprint.com/v1/hubs/' + _hubId + '/api_key',
      data: {},
    }).then(function successCallback(response) {
      return response.data;
    }, function errorCallback(response) {
      console.log('Unable to generate hub API key');
      console.log(JSON.stringify(response));
      return false;
    });
  };

  /**
   * DeleteHub
   * deletes a hub by id
   *
   * @param id
   * @returns {promise}
   */
  this.deleteHub = function(id) {
    return $http({
      method: 'DELETE',
      url: 'https://dev.api.stratusprint.com/v1/hubs/' + id,
    }).then(function successCallback(response) {
      console.log('Trying to delete: ' + JSON.stringify(response));
      return response.data;

    }, function errorCallback(response) {
      console.log('Failed to delete hub: ' + JSON.stringify(response));
      return response.data;
    });
  };

  /**
   * ViewHub
   * Returns a hub with the associated id
   *
   * @param id
   * @returns {promise}
   */
  this.getHub = function(id) {
    return $http({
      method: 'GET',
      url: 'https://dev.api.stratusprint.com/v1/hubs/' + id,
    });
  };

  /**
   * UpdateHub
   * Updates the information of the hub with the associated id
   * @param _hubId
   * @param _hub
   *
   * @returns {$q} promise if it succeeds
   * @returns {boolean} if it fails
   */
  this.updateHub = function(_hubId, _hub) {
    return $http({
      method: 'PATCH',
      url: 'https://dev.api.stratusprint.com/v1/hubs/' + _hubId,
      data: {hub: _hub},
    }).then(function successCallback(response) {
      return response.data;
    }, function errorCallback(response) {
      console.log('Failed to update the hub with id of: ' + _hubId);
      console.log(JSON.stringify(response));
      return false;
    });
  };

  /**
   * GetSensors
   * performs a get request to retrieve the sensors associated with a hub
   * returns a promise that this data will be retrieved
   *
   * @param id
   * @returns {$q} (promise)
   */
  this.getSensors = function(id) {
    return $http({
      method: 'GET',
      url: 'https://dev.api.stratusprint.com/v1/hubs/' + id + '/sensors',
    });
  };

  /**
   * Delete sensor
   * @param  {Integer} id The ID of the sensor to delete
   * @return {Promise}    $http promise
   */
  this.deleteSensor = function(id) {
    return $http({
      method: 'DELETE',
      url: 'https://dev.api.stratusprint.com/v1/sensors/' + id,
    });
  };

  /**
   * GetPrinters
   * performs a get request to retrieve the printers associated with a hub
   * returns a promise that this data will be retrieved
   *
   * @param hubId
   * @returns {$q} (promise)
   */
  this.getPrinters = function(hubId) {
    return $http({
      method: 'GET',
      url: 'https://dev.api.stratusprint.com/v1/hubs/' + hubId + '/printers',
    });
  };

  /**
   * Update a sensor
   *
   * @param  {Integer} sensorId   The ID of the sensor
   * @param  {Object} attributes   The attributes to update
   * @return {Promise}            $http promise
   */
  this.updateSensor = function(sensorId, attributes) {
    return $http({
      method: 'PATCH',
      url: 'https://dev.api.stratusprint.com/v1/sensors/' + sensorId,
      data: attributes,
    });
  };

  /**
   * Add a sensor
   *
   * @param {Integer} hubId      The ID of the hub which the sensor belongs to
   * @param {Object}  attributes The attributes of the new sensor
   */
  this.addSensor = function(hubId, attributes) {
    return $http({
      method: 'POST',
      url: 'https://dev.api.stratusprint.com/v1/hubs/' + hubId + '/sensors',
      data: attributes,
    });
  };

  /**
     *GetStatistics
     * performs a get request to retrieve the statistics associated with a hub
     * returns a promise that this data will be retrieved
     *
     * @param hubId
     * @returns {$q} (promise)
     */
  this.getStatistics = function(hubId) {
    return $http({
      method: 'GET',
      url: 'https://dev.api.stratusprint.com/v1/hubs/' + hubId + '/statistics',
    }).then(function successCallback(response) {
      return response.data;

    }, function errorCallback(response) {
      console.log('Failed to retrieve the statistics of the hub with id of: ' + hubId);
      console.log(JSON.stringify(response));
      return response.data;
    });
  };
}
