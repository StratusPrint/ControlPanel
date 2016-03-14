var theApp = angular.module('theApp', ['ngRoute', 'ng-token-auth']);

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

  theApp.config(function($authProvider) {
    $authProvider.configure({
      apiUrl: 'https://dev.api.stratusprint.com/v1'
    });
  });

  theApp.controller('mainCtrl', function($scope) {
    $scope.message =
      'This is the main controller and can be on every page, if we want!';
  });

  theApp.controller('loginCtrl', function($scope,$auth) {
    $scope.handleLoginBtnClick = function() {
      $auth.submitLogin($scope.loginForm)
      .then(function(resp) {
        // handle success response
      })
      .catch(function(resp) {
        console.log("Obviously got an error response!");
        $scope.loginErrorMessage = "Sorry, but uh we couldn't find you, try again";
        // handle error response
      });
    };

  });

  theApp.controller('dashboardCtrl', function($scope) {
    $scope.message = 'Welcome to the Dashboard!';
  });
