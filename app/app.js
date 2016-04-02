angular.module('ControlPanel', [
    'ui.router',
    'ng-token-auth',
    'LocalStorageModule'
]);

var app = angular.module('ControlPanel');

app.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
        .state('login', {
          url: '/login',
          templateUrl: 'control-panel/views/login/loginView.html',
          controller: 'AuthCtrl',
          data: {
            requireLogin: false
          }
        })
        .state('dashboard', {
          url: '/dashboard',
          templateUrl: 'control-panel/views/dashboard/dashboardView.html',
          controller: 'DashboardCtrl',
          data: {
            requireLogin: true
          }
        })
        .state('register', {
          url: '/register',
          templateUrl: 'control-panel/views/register/registerView.html',
          controller: 'RegisterCtrl',
          data: {
            requireLogin: true
          }
        })
        .state('profile', {
          url: '/profile',
          templateUrl: 'control-panel/views/profile/profileView.html',
          controller: 'ProfileCtrl',
          data: {
            requireLogin: true
          }
        });
  $urlRouterProvider.otherwise('dashboard');
});

app.config(function($authProvider) {
  $authProvider.configure({
    apiUrl: 'https://dev.api.stratusprint.com/v1'
  });
});

app.run(function($rootScope, $state, user, auth) {
  $rootScope.user = user;
  $rootScope.auth = auth;
});
