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
    }).then(function successCallback(response) {
      return response.data;
    }, function errorCallback(response) {


      // Error response right here
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
      url: 'https://dev.api.stratusprint.com/v1/hubs/' + _hubId + '/generate_api_key',
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
      console.log('In delete: ' + JSON.stringify(response));
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
    }).then(function successCallback(response) {
      return response.data;

    }, function errorCallback(response) {
      console.log('Failed to retreive the hub with id of: ' + id);
      console.log(JSON.stringify(response));
      return response.data;
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
    }).then(function successCallback(response) {
      return response.data;

    }, function errorCallback(response) {
      console.log('Failed to retrieve the sensor with id of: ' + id);
      console.log(JSON.stringify(response));
      return response.data;
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
    }).then(function successCallback(response) {
      return response.data;

    }, function errorCallback(response) {
      console.log('Failed to retrieve the sensor with id of: ' + hubId);
      console.log(JSON.stringify(response));
      return response.data;
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
