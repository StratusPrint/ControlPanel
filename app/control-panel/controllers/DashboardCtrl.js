app.controller('DashboardCtrl', DashboardCtrl);

DashboardCtrl.$inject = ['$scope'];

function DashboardCtrl($scope) {
    $scope.message = 'Welcome to the Dashboard!';
}
