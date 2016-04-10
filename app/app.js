angular.module('ControlPanel', [
    'ui.router',
    'ng-token-auth',
    'LocalStorageModule',
    'ui.bootstrap',
    'ui.bootstrap.showErrors',
    'validation.match',
    'datatables',
]);

var app = angular.module('ControlPanel');

app.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
        .state('login', {
          url: '/login',
          params: {
            passwordResetEmailSent: {
              value: false,
            },
            passwordReset: {
              value: false,
            },
            hiddenParam: 'YES',
          },
          templateUrl: 'control-panel/views/auth/login.html',
          controller: 'AuthCtrl',
          data: {
            requireLogin: false,
          },
        })
        .state('reset-password', {
          url: '/reset-password',
          templateUrl: 'control-panel/views/auth/reset-password.html',
          controller: 'AuthCtrl',
          data: {
            requireLogin: false,
          },
        })
        .state('change-password', {
          url: '/change-password',
          templateUrl: 'control-panel/views/auth/change-password.html',
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
        })
        .state('dashboard.hubs', {
          url: '/hubs',
          templateUrl: 'control-panel/views/dashboard/listHubs.html',
          controller: 'HubsCtrl',
          data: {
            requireLogin: true,
          },
        })
        .state('dashboard.hubs.hubId', {
          url: '/:hubId',
          templateUrl: 'control-panel/views/dashboard/showHub.html',
          controller: 'HubDetailsCtrl',
          params: {
            hubId: {
              value: '0',
            },
          },
          data: {
            requireLogin: true,
          },
        });
  $urlRouterProvider.otherwise('dashboard');
});

app.config(function($authProvider) {
  $authProvider.configure({
    apiUrl: 'https://dev.api.stratusprint.com/v1',
    passwordResetSuccessUrl: 'https://dev.stratusprint.com/#/change-password',
  });
});

app.run(function($rootScope, $state, user, auth) {
  $rootScope.user = user;
  $rootScope.auth = auth;
});
