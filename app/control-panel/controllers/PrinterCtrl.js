// jscs:disable

app.controller('PrinterCtrl', PrinterCtrl);

PrinterCtrl.$inject = ['$scope', '$state', '$stateParams', '$controller', 'printer'];

function PrinterCtrl($scope, $state, $stateParams, $controller, printer) {
	$scope.queuedJobs = [];
	$scope.completedJobs = [];
	$scope.processingJobs = [];
	$scope.jobs = [];
	$scope.currentJob = [];
	$scope.commands = [];
	$scope.printer = [];
	$scope.command = [];
	$scope.currentJobAlert = [];
	$scope.processingJobsConfig = {
		itemsPerPage: 5,
		maxPages: 5,
		fillLastPage: "no"
	};
	$scope.completedJobsConfig = {
		itemsPerPage: 5,
		maxPages: 5,
		fillLastPage: "no"
	};
	$scope.queuedJobsConfig = {
		itemsPerPage: 5,
		maxPages: 5,
		fillLastPage: "no"
	};
	$scope.issuedCommandsConfig = {
		itemsPerPage: 5,
		maxPages: 5,
		fillLastPage: "no"
	};

	/**
	 * Retrieve list of all queued jobs associated with this printer
	 */
	$scope.getQueuedJobs = function() {
		printer.getQueuedJobs($stateParams.printerId)
			.success(function(response) {
				$scope.queuedJobs = response;
			})
			.error(function(response) {
				console.log('Unable to retrieve list of queued jobs.');
				console.log(response);
			});
	};

	/**
	 * Retrieve list of all queued jobs associated with this printer
	 */
	$scope.getProcessingJobs = function() {
		printer.getProcessingJobs($stateParams.printerId)
			.success(function(response) {
				$scope.processingJobs = response;
			})
			.error(function(response) {
				console.log('Unable to retrieve list of processing jobs.');
				console.log(response);
			});
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
	 * Retrieve list of all completed jobs associated with this printer
	 */
	$scope.getCompletedJobs = function() {
		printer.getCompletedJobs($stateParams.printerId)
			.success(function(response) {
				$scope.completedJobs = response;
			})
			.error(function(response) {
				console.log('Unable to retrieve list of completed jobs.');
				console.log(response);
			});
	};

	/**
	 * Retrieve list of all jobs associated with this printer
	 */
	$scope.getJobs = function() {
		printer.getJobs($stateParams.printerId)
			.success(function(response) {
				$scope.jobs = response;
			})
			.error(function(response) {
				console.log('Unable to retrieve list of all jobs.');
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
		if(!$scope.command.length) { return; }

		printer.issueCommand($stateParams.printerId, $scope.command)
			.success(function(response) {
				$scope.addAlert('info', 'The ' + $scope.command + ' command has been sent to the printer. Please wait a minute for the command be executed and the current job status updated.');
			})
			.error(function(response) {
				$scope.addAlert('danger', 'Command successfully issued.');
				console.log(response);
			});
	};

	/**
	 * Refresh data.
	 */
	$scope.refresh = function() {
		$scope.getCompletedJobs();
		$scope.getQueuedJobs();
		$scope.getProcessingJobs();
		$scope.getCurrentJob();
		$scope.getCommands();
		$scope.getPrinter();
		$scope.getJobs();	
	};

	$controller('AlertCtrl', { $scope: $scope });

	$scope.refresh();

/*
	this.interval = setInterval(function(){
		$scope.refresh();
	}, 2000);*/

	$scope.$watch('command', $scope.issueCommand);
}
