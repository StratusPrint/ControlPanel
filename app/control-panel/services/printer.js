app.service('printer', PrinterService);

PrinterService.$inject = ['$http'];

function PrinterService($http) {
  var service = {
    getJobs: getJobs,
    jobs: [],
    getCurrentJob: getActiveJobs,
    currentJob: [],
    getProcessingJobs: getProcessingJobs,
    processingJobs: [],
    getQueuedJobs: getQueuedJobs,
    queuedJobs: [],
    getPrinter: getPrinter,
    printer: [],
    issueCommand: issueCommand,
    getCommands: getCommands,
    commands: [],
  };
  return service;

  /**
   * Retreieve jobs associated with a printer
   *
   * @param  {Integer} printerId The ID of the printer
   * @return {Promise}           $http promise
   */
  function getJobs(printerId) {
    return $http({
        method: 'GET',
        url: 'https://dev.api.stratusprint.com/v1/printers/' + printerId + '/jobs',
      }).success(function(data) {
        service.jobs = data;
      });
  }

  /**
   * Retreieve a printer
   *
   * @param  {Integer} printerId The ID of the printer
   * @return {Promise}           $http promise
   */
  function getPrinter(printerId) {
    return $http({
        method: 'GET',
        url: 'https://dev.api.stratusprint.com/v1/printers/' + printerId,
      }).success(function(data) {
        service.printer = data;
      });
  }

  /**
   * Issue a command to a printer
   *
   * @param  {Integer} printerId The ID of the printer
   * @param  {String}  command   The command to issue
   * @return {Promise}           $http promise
   */
  function issueCommand(printerId, command) {
    return $http({
        method: 'POST',
        url: 'https://dev.api.stratusprint.com/v1/printers/' + printerId + '/commands',
        data: {
          name: command,
        },
      });
  }

  /**
   * Retrieve all commands issued to a printer
   *
   * @param  {Integer} printerId The ID of the printer
   * @return {Promise}           $http promise
   */
  function getCommands(printerId) {
    return $http({
        method: 'GET',
        url: 'https://dev.api.stratusprint.com/v1/printers/' + printerId + '/commands',
        data: {
          name: command,
        },
      }).success(function(data) {
        service.commands = data;
      });
  }

  /**
   * Update a printer
   *
   * @param  {Integer} printerId  The ID of the printer
   * @param  {JSON}    attributes New printer attributes
   * @return {Promise}            $http promise
   */
  function update(printerId, attributes) {
    return $http({
        method: 'PATCH',
        url: 'https://dev.api.stratusprint.com/v1/printers/' + printerId,
        data: attributes,
      }).success(function(data) {
        service.printer = data;
      });
  }

  function getCurrentJob() {}

  function getQueuedJobs() {}

  function getProcessingJobs() {}

}
