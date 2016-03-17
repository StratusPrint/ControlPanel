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
        controller: 'dashboardCtrl',
        resolve: {
          auth: ['$auth', function($auth) {

            var aut = $auth.validateUser();

            return aut;
          }]
        }
      }).

      when('/register',{
        templateUrl: 'components/register/registerView.html',
        controller: 'registerCtrl'
      }).

      otherwise({
        redirectTo: '/'
      });

  }]);

theApp.config(function($authProvider) {
    $authProvider.configure({
      apiUrl: 'https://dev.api.stratusprint.com/v1',
      tokenValidationPath:     '/auth/validate_token',
      signOutUrl:              '/auth/sign_out',
      emailRegistrationPath:   '/auth',
      confirmationSuccessUrl:  '/dashboard',
      emailSignInPath:         '/auth/sign_in',
      storage:                 'cookies',
      forceValidateToken:      false,
      //apiUrl: 'http://localhost:8081/v1'
    });
  });

theApp.controller('mainCtrl', function($scope) {
    $scope.message =
      'This is the main controller and can be on every page, if we want!';
  });

/*Setting up authentication, redirections, and signout*/
theApp.run(function($rootScope, $location, $auth) {

  $rootScope.$on('auth:invalid',function(e) {
    $location.path('/login');
  });

  $rootScope.$on('auth:login-success',function(e) {
    $location.path('/dashboard');
  });

  $rootScope.signout = function() {
    $auth.signOut()
        .then(function(resp) {
          alert('You were successfully logged out');
          $location.path('/');
        })
        .catch(function(resp) {
          // handle error response
          alert('You were successfully logged out');
          console.log(resp);
        });
  };

  $rootScope.$on('auth:logout-error', function(ev, reason) {
    alert('logout failed because ' + reason.errors[0]);
  });

});
