angular.module('ControlPanel', [
    'ui.router',
    'ng-token-auth'
]);

var app = angular.module('ControlPanel');

var user;

app.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
        .state('/login', {
          url: '/login',
          templateUrl: 'control-panel/views/login/loginView.html',
          controller: 'LoginCtrl'
        })
        .state('/dashboard', {
          url: '/dashboard',
          templateUrl: 'control-panel/views/dashboard/dashboardView.html',
          controller: 'DashboardCtrl',
          resolve: {
            auth: ['$auth', function($auth) {
              var aut = $auth.validateUser();
              return aut;
            }]
          }
        })
        .state('/register', {
          url: '/register',
          templateUrl: 'control-panel/views/register/registerView.html',
          controller: 'RegisterCtrl'
        })
        .state('/profile', {
          url: '/profile',
          templateUrl: 'control-panel/views/profile/profileView.html',
          controller: 'ProfileCtrl',
          resolve: {
            auth: ['$auth', function($auth) {
              var aut = $auth.validateUser();
              return aut;
            }]
          }
        });
  $urlRouterProvider.otherwise('/dashboard');
  //To remove the hash from the URL
  /* $locationProvider.html5Mode({
     enabled: true,
     requireBase: false
   });*/
});

app.config(function($authProvider) {
  $authProvider.configure({
    apiUrl: 'https://dev.api.stratusprint.com/v1',
    handleLoginResponse: function(response) {
      SetUser(response);
      return response;
    }
  });
});

/* Setting up authentication, redirections, and signout */
app.run(function($rootScope, $state, $auth) {
  $rootScope.$on('auth:invalid', function(e) {
    $state.go('/login');
  });

  $rootScope.$on('auth:login-success', function(e) {
    //$rootScope.user = GetUser();
    $state.go('/dashboard');
  });

  $rootScope.$on('auth:logout-error', function(ev, reason) {
    alert('had a problem logging out ');
  });

  $rootScope.$on('auth:account-update-success', function(ev) {
    alert('Your account has been successfully updated!');
  });

  $rootScope.$on('auth:validation-success', function(ev) {
    $state.go('/dashboard');
  });

});

function SetUser(userInfo) {
  user = {
    id: userInfo.data.id,
    email: userInfo.data.email,
    name: userInfo.data.name,
    nickname: userInfo.data.nickname,
    image: userInfo.data.image,
    admin: userInfo.data.admin
  };
  if (user.image === null) {
    console.log('going here?');
    user.image = 'assets/img/avatar.png';
  }
  if (user.admin === null) {
    user.admin = false;
  }
}

function GetUser() {
  return user;
}
