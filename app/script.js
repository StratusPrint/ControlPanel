var theApp = angular.module('theApp', ['ngRoute']);

theApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/', {
        templateUrl: 'index.html',
        controller: 'mainController'
      }).
      when('/test', {
        templateUrl: 'components/view1/view1.html',
        controller: 'testController'
      }).
      otherwise({
        redirectTo: '/'
      });
  }]);
theApp.controller('mainController', function($scope) {
  $scope.message = 'Main Controller!';
});

theApp.controller('testController', function($scope) {
  $scope.message = 'Testing 1-2-3';
});
