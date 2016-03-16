var theApp = angular.module('theApp', ['ngRoute', 'ng-token-auth']);

theApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      //Can add in if user is autheticated here!
      when('/', {
        controller: 'mainCtrl',
        redirectTo: '/login'
      }).

        when('/login', {
          templateUrl: 'components/login/loginView.html',
          controller: 'loginCtrl'
        }).

          when('/dashboard', {
            templateUrl: 'components/dashboard/dashboardView.html',
            controller: 'dashboardCtrl',
            resolve: {
              auth: function($auth) {
                return $auth.validateUser();
              }
            } 
          }).

            otherwise({
              redirectTo: '/login'
            });

  }]);

  theApp.config(function($authProvider) {
    $authProvider.configure({
      //apiUrl: 'https://dev.api.stratusprint.com/v1'
      apiUrl: 'http://localhost:8081/v1',
      //validateOnPageLoad: false
    });
  });

  theApp.controller('mainCtrl', function($scope) {
    $scope.message =
      'This is the main controller and can be on every page, if we want!';
  });

