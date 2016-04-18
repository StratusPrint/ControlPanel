app.service('hub', HubService);

HubService.$inject = ['$http', '$state'];

function HubService($http, $state) {
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
   * @returns {JSON} response
   */
  this.addHub = function(hub) {
    return $http({
      method: 'POST',
      url: 'https://dev.api.stratusprint.com/v1/hubs',
      data: {hub: hub},
    }).then(function successCallback(response) {
      return response.data;

    }, function errorCallback(response) {

      return response.data;
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
      return response.data;

    }, function errorCallback(response) {
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
      return response.data;
    });
  };

  /**
   * UpdateHub
   * Updates the information of the hub with the associated id
   * @param _hubId
   * @param _hub
   * @returns {boolean}
   */
  this.updateHub = function(_hubId, _hub) {
    return $http({
      method: 'PATCH',
      url: 'https://dev.api.stratusprint.com/v1/hubs/' + _hubId,
      data: {hub: _hub},
    }).then(function successCallback(response) {
      console.log('Hub updated! ' + JSON.stringify(response.data));
      return true;

    }, function errorCallback(response) {
      return false;
    });
  };

  this.getSensors = function(id) {
    console.log('service: ' + id);
    return $http({
      method: 'GET',
      url: 'https://dev.api.stratusprint.com/v1/hubs/' + id + '/sensors',
    }).then(function successCallback(response) {
      return response.data;

    }, function errorCallback(response) {
      return response.data;
    });
  };

  this.getPrinters = function(hubId) {
    console.log('service: ' + hubId);
    return $http({
      method: 'GET',
      url: 'https://dev.api.stratusprint.com/v1/hubs/' + hubId + '/printers',
    }).then(function successCallback(response) {
      return response.data;

    }, function errorCallback(response) {
      return response.data;
    });
  };

}
