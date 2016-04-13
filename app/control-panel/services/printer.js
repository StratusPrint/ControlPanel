app.service('printer', PrinterService);

PrinterService.$inject = ['$http'];

function PrinterService($http) {

  /**
   * GetSensor
   * Returns a promise to retreive the printer with the associated ID
   * @param _sensorId
   * @returns {promise}
   */
  this.getById = function(_printerId) {
    return $http({
      method: 'GET',
      url: 'https://dev.api.stratusprint.com/v1/printers/' + _printerId,
    }).then(function successCallback(response) {
      return response.data;
    }, function errorCallback(response) {
      return response.data;
    });
  };



  /**
   * Update
   * Updates information of the printer with the associated ID
   * Returns a promise of retreieving the new JSON object that is the updated sensor
   * @param _sensorId
   * @returns {promise}
   */
  this.update = function(_printerId) {
    return $http({
      method: 'PATCH',
      url: 'https://dev.api.stratusprint.com/v1/printers/' + _printerId,
    }).then(function successCallback(response) {
      return response.data;
    }, function errorCallback(response) {
      return response.data;
    });
  };

  /**
   * GetJobs
   * Returns a promise to retrieve the data from the printer with the associated ID
   * @param _sensorId
   * @returns {promise}
   */
  this.getJobs = function(_printerId) {
    return $http({
      method: 'GET',
      url: 'https://dev.api.stratusprint.com/v1/printers/' + _printerId + '/jobs',
    }).then(function successCallback(response) {
      return response.data;
    }, function errorCallback(response) {
      return response.data;
    });
  };

  /**
   * AddJob
   * Adds a job to an associated printer
   *
   * @param _printerId
   * @param _job
   * @returns {promise}
   */
  this.addJob = function(_printerId, _job) {
    return $http({
      method: 'POST',
      url: 'https://dev.api.stratusprint.com/v1/printers/' + _printerId + '/jobs',
      data: {job: _job},
    }).then(function successCallback(response) {
      console.log('Job added!' + JSON.stringify(response.data));
      return response.data;
    }, function errorCallback(response) {
      return response.data;
    });
  };

}
