app.service('sensor', SensorService);

SensorService.$inject = ['$http'];

function SensorService($http) {

  /**
   * GetSensor
   * Returns a promise to retreive the sensor with the associated ID
   * @param _sensorId
   * @returns {promise}
   */
  this.getById = function(_sensorId) {
    return $http({
      method: 'GET',
      url: 'https://dev.api.stratusprint.com/v1/sensors/' + _sensorId,
    }).then(function successCallback(response) {
      return response.data;
    }, function errorCallback(response) {
      return response.data;
    });
  };

  /**
   * GetData
   * Returns a promise to retrieve the data from the sensor with the associated ID
   * @param _sensorId
   * @returns {promise}
   */
  this.getData = function(_sensorId, _hoursAgo) {
    return $http({
      method: 'GET',
      url: 'https://dev.api.stratusprint.com/v1/sensors/' + _sensorId + '/data' + '?hours_ago=' + _hoursAgo,
    }).then(function successCallback(response) {
      return response.data;
    }, function errorCallback(response) {
      return response.data;
    });
  };

  /**
   * Update
   * Updates information of the sensor with the associated ID
   * Returns a promise of retreieving the new JSON object that is the updated sensor
   * @param _sensorId
   * @returns {promise}
   */
  this.update = function(_sensorId) {
    return $http({
      method: 'PATCH',
      url: 'https://dev.api.stratusprint.com/v1/sensors/' + _sensorId,
    }).then(function successCallback(response) {
      return response.data;
    }, function errorCallback(response) {
      return response.data;
    });
  };

}
