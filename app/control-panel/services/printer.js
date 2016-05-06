app.service('printer', PrinterService);

PrinterService.$inject = ['$http'];

function PrinterService($http) {
  var service = {
    getCurrentJob: getCurrentJob,
    getProcessingJobs: getProcessingJobs,
    getQueuedJobs: getQueuedJobs,
    getCompletedJobs: getCompletedJobs,
    getRecentJobs: getRecentJobs,
    getPrinter: getPrinter,
    deletePrinter: deletePrinter,
    issueCommand: issueCommand,
    getCommands: getCommands,
    cancelJob: cancelJob,
    getJobs: getJobs,
    jobs: [],
    currentJob: [],
    processingJobs: [],
    queuedJobs: [],
    completedJobs: [],
    recentJobs: [],
    printer: [],
    update: update,
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
   * Retreieve list of recent jobs associated with a printer
   *
   * @param  {Integer} printerId The ID of the printer
   * @return {Promise}           $http promise
   */
  function getRecentJobs(printerId) {
    return $http({
        method: 'GET',
        url: 'https://dev.api.stratusprint.com/v1/printers/' + printerId + '/recent_jobs',
      }).success(function(data) {
        service.recentJobs = data;
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
   * Delete a printer
   *
   * @param  {Integer} printerId The ID of the printer
   * @return {Promise}           $http promise
   */
  function deletePrinter(printerId) {
    return $http({
      method: 'DELETE',
      url: 'https://dev.api.stratusprint.com/v1/printers/' + printerId,
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

  /**
   * Retreieve the current associated with a printer
   *
   * @param  {Integer} printerId The ID of the printer
   * @return {Promise}           $http promise
   */
  function getCurrentJob(printerId) {
    return $http({
        method: 'GET',
        url: 'https://dev.api.stratusprint.com/v1/printers/' + printerId + '/current_job',
      }).success(function(data) {
        service.currentJob = data;
      });
  }

  /**
   * Cancel a job
   * @param  {Integer} jobId The ID of the job to cancel
   * @return {Promise}       $http promise
   */
  function cancelJob(jobId) {
    return $http({
        method: 'DELETE',
        url: 'https://dev.api.stratusprint.com/v1/jobs/' + jobId,
      });
  }

  /**
   * Retreieve queued jobs associated with a printer
   *
   * @param  {Integer} printerId The ID of the printer
   * @return {Promise}           $http promise
   */
  function getQueuedJobs(printerId) {
    return $http({
        method: 'GET',
        url: 'https://dev.api.stratusprint.com/v1/printers/' + printerId + '/queued_jobs',
      }).success(function(data) {
        service.queuedJobs = data;
      });
  }

  /**
   * Retreieve processing jobs associated with a printer
   *
   * @param  {Integer} printerId The ID of the printer
   * @return {Promise}           $http promise
   */
  function getProcessingJobs(printerId) {
    return $http({
        method: 'GET',
        url: 'https://dev.api.stratusprint.com/v1/printers/' + printerId + '/processing_jobs',
      }).success(function(data) {
        service.processingJobs = data;
      });
  }

  /**
   * Retreieve completed jobs associated with a printer
   *
   * @param  {Integer} printerId The ID of the printer
   * @return {Promise}           $http promise
   */
  function getCompletedJobs(printerId) {
    return $http({
        method: 'GET',
        url: 'https://dev.api.stratusprint.com/v1/printers/' + printerId + '/completed_jobs',
      }).success(function(data) {
        service.completedJobs = data;
      });
  }
}
