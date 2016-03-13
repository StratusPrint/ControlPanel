var theApp = angular.module('theApp', ['ngRoute']);

theApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      //Can add in if user is autheticated here!
      when('/', {
        controller: 'mainCtrl'
      }).

      when('/login', {
        templateUrl: 'components/login/loginView.html',
        controller: 'loginCtrl'
      }).

      when('/dashboard', {
        templateUrl: 'components/dashboard/dashboardView.html',
        controller: 'dashboardCtrl'
      }).

      otherwise({
        redirectTo: '/'
      });

  }]);

theApp.controller('mainCtrl', function($scope) {
  $scope.message =
    'This is the main controller and can be on every page, if we want!';
});

theApp.controller('loginCtrl', function($scope) {
  $scope.message = 'Welcome to Login!';
});

theApp.controller('dashboardCtrl', function($scope) {
  $scope.message = 'Welcome to the Dashboard!';
});
