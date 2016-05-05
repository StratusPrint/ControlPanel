// jscs:disable

app.controller('PrinterCtrl', PrinterCtrl);

PrinterCtrl.$inject = ['$scope', '$state', '$stateParams', '$timeout', '$controller', '$interval', 'printer'];

function PrinterCtrl($scope, $state, $stateParams, $timeout, $controller, $interval, printer) {
    $scope.recentJobs = [];
    $scope.commands = [];
    $scope.printer = [];
    $scope.command = { name: '' };
    $scope.currentJobAlert = [];

    $scope.printerModal = {};
    $scope.printerModal.form = {};
    $scope.printerModal.printer = {};
    $scope.printerModalVisible = false;

    $scope.deletePrinterModal = {};
    $scope.deleteprinterModalVisible = false;

    $scope.cancelJobModal = {};
    $scope.cancelJobModalVisible = false;

    $scope.issuedCommandsConfig = {
        itemsPerPage: 6,
        maxPages: 5,
        fillLastPage: "no"
    };

    /**
     * Update printer profile
     */
    $scope.updatePrinter = function(attributes) {
        printer.update($stateParams.printerId, attributes)
            .success(function(response) {
                $scope.printerModal.addAlert('success', 'The printer has been updated successfully.');
                $scope.getPrinter();
                $scope.printerModal.form.$setPristine();
                $scope.printerModal.printer = {};
            })
            .error(function(response) {
                $scope.printerModal.addAlert('danger', 'Unable to update printer. Please double check that the specified name is not already in use by another printer.');
                console.log(response);
            });
    };

    /**
     * Delete printer
     */
    $scope.deletePrinter = function(printerId) {
        printer.deletePrinter(printerId)
            .success(function(response) {
                $timeout(function() {
                    $state.go('dashboard.viewHub', { hubId: $stateParams.hubId });
                }, 500);
            });
    };

    /**
     * Cancel a job
     */
    $scope.cancelJob = function(job) {
      job.isCancelled = true;
      // do some stuff that cancels the job
    };

    /**
     * Modal visibility toggling
     */
    $scope.showPrinterModal = function() {
        $scope.printerModalVisible = true;
    };

    $scope.hidePrinterModal = function() {
        $scope.printerModalVisible = false;
        $scope.printerModal.alerts = [];
    };

    $scope.showCancelJobModal = function() {
        $scope.cancelJobModalVisible = true;
    };

    $scope.hideCancelJobModal = function() {
        $scope.cancelJobModalVisible = false;
    };

    $scope.showDeletePrinterModal = function() {
        $scope.deletePrinterModalVisible = true;
    };

    $scope.hideDeletePrinterModal = function() {
        $scope.deletePrinterModalVisible = false;
    };

    /**
     * Retrieve the current job associated with this printer
     */
    $scope.getCurrentJob = function() {
        printer.getCurrentJob($stateParams.printerId)
            .success(function(response) {
                $scope.currentJob = response;
                if(response.id) {
                    $scope.currentJob.show = true;
                } else {
                    $scope.currentJob.show = false;
                }
            })
            .error(function(response) {
                console.log('Unable to retrieve current job.');
                console.log(response);
                $scope.currentJob.show = false;
            });
    };

    /**
     * Retrieve the commands issued to this printer
     */
    $scope.getCommands = function() {
        printer.getCommands($stateParams.printerId)
            .success(function(response) {
                $scope.commands = response;
                if(response.length) {
                    $scope.showCommands = true;
                } else {
                    $scope.showCommands = false;
                }
                
            })
            .error(function(response) {
                console.log('Unable to retrieve list of commands.');
                console.log(response);
                $scope.showCommands = false;
            });
    };

    /**
     * Retrieve list of recent jobs associated with this printer
     */
    $scope.getRecentJobs = function() {
        printer.getRecentJobs($stateParams.printerId)
            .success(function(response) {
                $scope.recentJobs = response;
                if(response.length) {
                    $scope.showRecentJobs = true;
                } else {
                    $scope.showRecentJobs = false;
                }
            })
            .error(function(response) {
                console.log('Unable to retrieve list of recent jobs.');
                console.log(response);
                $scope.showRecentJobs = false;
            });
    };

    /**
     * Retrieve list of all completed jobs associated with this printer
     */
    $scope.getPrinter = function() {
        printer.getPrinter($stateParams.printerId)
            .success(function(response) {
                $scope.printer = response;
            })
            .error(function(response) {
                console.log('Unable to retrieve printer.');
                console.log(response);
                $state.go('dashboard.404');
            });
    };

    /**
     * Issue a printer command.
     */
    $scope.issueCommand = function() {
        if ($scope.command.name === '') {
            return; }

        printer.issueCommand($stateParams.printerId, $scope.command.name)
            .success(function(response) {
                $scope.addAlert('info', 'The ' + $scope.command.name + ' command has been sent to the printer. Please wait a minute for the command be executed and the current job status updated.');
            })
            .error(function(response) {
                $scope.addAlert('danger', 'Unable to issue command. Please try again.');
                console.log(response);
            });
    };

    /**
     * Refresh data.
     */
    $scope.refresh = function() {
        $scope.getCurrentJob();
        $scope.getCommands();
        $scope.getPrinter();
        $scope.getRecentJobs();
    };

    $controller('AlertCtrl', { $scope: $scope });
    $controller('AlertCtrl', { $scope: $scope.printerModal });

    $scope.refresh();

    var timerPromise;
    $scope.timer = function() {
        timerPromise = $interval($scope.refresh, 2000);
    };

    $scope.timer();

    $scope.$on('$destroy', function() {
        if (timerPromise) {
            $interval.cancel(timerPromise);
        }
    });

    $scope.$watch('command.name', $scope.issueCommand);
}
