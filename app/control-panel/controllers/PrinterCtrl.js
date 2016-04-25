// jscs:disable

app.controller('PrinterCtrl', PrinterCtrl);

PrinterCtrl.$inject = ['$scope', '$state', '$stateParams', 'printer'];

function PrinterCtrl($scope, $state, $stateParams, printer) {
	$scope.queuedJobs = [];
	$scope.completedJobs = [];
	$scope.processingJobs = [];
	$scope.currentJob = [];
	$scope.commands = [];
	$scope.printer = [];

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

	$scope.getCompletedJobs();
	$scope.getQueuedJobs();
	$scope.getProcessingJobs();
	$scope.getCurrentJob();
	$scope.getCommands();
	$scope.getPrinter();
}
