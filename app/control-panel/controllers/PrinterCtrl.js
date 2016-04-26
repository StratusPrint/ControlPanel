// jscs:disable

app.controller('PrinterCtrl', PrinterCtrl);

PrinterCtrl.$inject = ['$scope', '$state', '$stateParams', '$controller', 'printer'];

function PrinterCtrl($scope, $state, $stateParams, $controller, printer) {
	$scope.recentJobs = [];
	$scope.commands = [];
	$scope.printer = [];
	$scope.command = [];
	$scope.currentJob = [];
	$scope.currentJobAlert = [];
	$scope.issuedCommandsConfig = {
		itemsPerPage: 6,
		maxPages: 5,
		fillLastPage: "no"
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
		$scope.getCurrentJob();
		$scope.getCommands();
		$scope.getPrinter();
		$scope.getRecentJobs();	
	};

	$controller('AlertCtrl', { $scope: $scope });

	$scope.refresh();

	this.interval = setInterval(function(){
		$scope.refresh();
	}, 2000);

	$scope.$watch('command', $scope.issueCommand);
}
