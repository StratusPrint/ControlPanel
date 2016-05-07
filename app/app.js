angular.module('ControlPanel', [
    'ui.router',
    'ng-token-auth',
    'LocalStorageModule',
    'ui.bootstrap',
    'ui.bootstrap.showErrors',
    'validation.match',
    'datatables',
    'ngFileUpload',
    'angular.vertilize',
    'angular-table',
    'angular.morris-chart',
    'ngSanitize',
    'ui.router.title',
    'readableTime',
]);

var app = angular.module('ControlPanel');

app.config(function($stateProvider, $urlRouterProvider, $locationProvider) {
  $stateProvider
  .state('login', {
    url: '/login?accountConfirmed',
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
    resolve: {
      $title: function() { return 'Please login'; },
    },
  })
  .state('reset-password', {
    url: '/reset-password',
    templateUrl: 'control-panel/views/auth/reset-password.html',
    controller: 'AuthCtrl',
    data: {
      requireLogin: false,
    },
    resolve: {
      $title: function() { return 'Reset Password'; },
    },
  })
  .state('change-password', {
    url: '/change-password',
    templateUrl: 'control-panel/views/auth/change-password.html',
    controller: 'AuthCtrl',
    data: {
      requireLogin: false,
    },
    resolve: {
      $title: function() { return 'Change Password'; },
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
    resolve: {
      $title: function() { return 'Dashboard'; },
    },

  })
  .state('dashboard.register', {
    url: '/register',
    templateUrl: 'control-panel/views/dashboard/register.html',
    controller: 'RegisterCtrl',
    data: {
      requireLogin: true,
    },
    resolve: {
      $title: function() { return 'Please Register a user'; },
    },

  })
  .state('dashboard.profile', {
    url: '/profile',
    templateUrl: 'control-panel/views/dashboard/profile.html',
    controller: 'ProfileCtrl',
    data: {
      requireLogin: true,
    },
    resolve: {
      $title: function() { return 'Profile'; },
    },
  })
  .state('dashboard.listHubs', {
    url: '/hubs',
    templateUrl: 'control-panel/views/dashboard/listHubs.html',
    controller: 'ListHubsCtrl',
    data: {
      requireLogin: true,
    },
    resolve: {
      $title: function() { return 'Environments'; },
    },

  })
  .state('dashboard.viewHub', {
    url: '/hubs/:hubId',
    templateUrl: 'control-panel/views/dashboard/viewHub.html',
    controller: 'ViewHubCtrl',
    data: {
      requireLogin: true,
    },
    resolve: {
      $title: function() { return 'HUB Management'; },
    },

  })

  .state('dashboard.printer', {
    url: '/hubs/:hubId/printers/:printerId',
    templateUrl: 'control-panel/views/dashboard/printer.html',
    controller: 'PrinterCtrl',
    data: {
      requireLogin: true,
    },
    resolve: {
      $title: function() { return 'Printer Management'; },
    },
  })

  .state('dashboard.404', {
    url: '/404',
    templateUrl: 'control-panel/views/dashboard/404.html',
    data: {
      requireLogin: true,
    },
    resolve: {
      $title: function() { return 'Oops! Page Not Found'; },
    },
  })
  .state('dashboard.users', {
    url: '/users',
    templateUrl: 'control-panel/views/dashboard/users.html',
    controller: 'UsersCtrl',
    data: {
      requireLogin: true,
    },
    resolve: {
      $title: function() { return 'User Management'; },
    },
  });

  $urlRouterProvider.otherwise('dashboard');
});

app.config(function($authProvider, $httpProvider) {
  $authProvider.configure({
    apiUrl: 'https://dev.api.stratusprint.com/v1',
    passwordResetSuccessUrl: 'https://dev.stratusprint.com/#/change-password',
    confirmationSuccessUrl: 'https://dev.stratusprint.com/#/login?accountConfirmed=true',
  });
  $httpProvider.interceptors.push('authInterceptor');
});

app.run(function($rootScope, $state, $stateParams, user, auth) {
  $rootScope.$state = $state;
  $rootScope.$stateParams = $stateParams;
  $rootScope.user = user;
  $rootScope.auth = auth;
});
