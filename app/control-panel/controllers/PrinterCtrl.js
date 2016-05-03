// jscs:disable

app.controller('PrinterCtrl', PrinterCtrl);

PrinterCtrl.$inject = ['$scope', '$state', '$stateParams', '$controller', '$interval', 'printer'];

function PrinterCtrl($scope, $state, $stateParams, $controller, $interval, printer) {
	$scope.recentJobs = [];
	$scope.commands = [];
	$scope.printer = [];
	$scope.command = {name: ''};
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
				$state.go('dashboard.viewHub', { hubId: $stateParams.hubId });
			});
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
			})
			.error(function(response) {
				console.log('Unable to retrieve current job.');
				console.log(response);
			});
	};

	/**
	 * Retrieve the commands issued to this printer
	 */
	$scope.getCommands = function() {
		printer.getCommands($stateParams.printerId)
			.success(function(response) {
				$scope.commands = response;
			})
			.error(function(response) {
				console.log('Unable to retrieve list of commands.');
				console.log(response);
			});
	};

	/**
	 * Retrieve list of recent jobs associated with this printer
	 */
	$scope.getRecentJobs = function() {
		printer.getRecentJobs($stateParams.printerId)
			.success(function(response) {
				$scope.recentJobs = response;
			})
			.error(function(response) {
				console.log('Unable to retrieve list of recent jobs.');
				console.log(response);
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
			});
	};

	/**
	 * Issue a printer command.
	 */
	$scope.issueCommand = function() {
		if($scope.command.name === '') { return; }

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
	$controller('AlertCtrl', { $scope: $scope.printerModal});

	$scope.refresh();
	
	var timerPromise;
	$scope.timer = function() {
		timerPromise = $interval($scope.refresh, 2000);
	};

	$scope.timer();

	$scope.$on('$destroy',function(){
	    if(timerPromise) {
	        $interval.cancel(timerPromise);   
	    }
	});

	$scope.$watch('command.name', $scope.issueCommand);
}
