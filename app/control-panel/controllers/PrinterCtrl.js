app.controller('PrinterCtrl', PrinterCtrl);

PrinterCtrl.$inject = ['$scope', '$state', '$stateParams', 'printer'];

function PrinterCtrl($scope, $state, $stateParams, printer) {
  /**
   * Retrieve list of all jobs associated with this printer
   */
  printer.getJobs($stateParams.printerId).success(function(response) {
    $scope.jobs = response;
  })
  .error(function(response) {
    console.log('Unable to retrieve list of jobs.');
    console.log(response);
  });

  /**
   * Retrieve list of all commands associated with this printer
   */
  printer.getCommands($stateParams.printerId).then(function(data) {
    $scope.commands = data;
  }).error(function(response) {
    console.log('Unable to retrieve list of commands.');
    console.log(repsonse);
  });
}
