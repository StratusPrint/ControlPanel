angular.module('ControlPanel', [
    'ui.router',
    'ng-token-auth',
    'LocalStorageModule',
]);

var app = angular.module('ControlPanel');

app.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
        .state('login', {
          url: '/login',
          templateUrl: 'control-panel/views/login/login.html',
          controller: 'AuthCtrl',
          data: {
            requireLogin: false,
          },
        })
        .state('dashboard', {
          templateUrl: 'control-panel/views/dashboard/common.html',
          abstract: true,
        })
        .state('dashboard.overview', {
          url: '/dashboard',
          templateUrl: 'control-panel/views/dashboard/overview.html',
          controller: 'DashboardCtrl',
          data: {
            requireLogin: true,
          },
        })
        .state('dashboard.register', {
          url: '/register',
          templateUrl: 'control-panel/views/dashboard/register.html',
          controller: 'RegisterCtrl',
          data: {
            requireLogin: true,
          },
        })
        .state('dashboard.profile', {
          url: '/profile',
          templateUrl: 'control-panel/views/dashboard/profile.html',
          controller: 'ProfileCtrl',
          data: {
            requireLogin: true,
          },
        });
  $urlRouterProvider.otherwise('dashboard');
});

app.config(function($authProvider) {
  $authProvider.configure({
    apiUrl: 'https://dev.api.stratusprint.com/v1',
  });
});

app.run(function($rootScope, $state, user, auth) {
  $rootScope.user = user;
  $rootScope.auth = auth;
});
