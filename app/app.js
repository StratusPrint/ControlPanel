angular.module('ControlPanel', [
    'ui.router',
    'ng-token-auth'
]);

var app = angular.module('ControlPanel');

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

        });
  $urlRouterProvider.otherwise('/login');
});

app.config(function($authProvider) {
  $authProvider.configure({
    apiUrl: 'https://dev.api.stratusprint.com/v1',

  });
});

/* Setting up authentication, redirections, and signout */
app.run(function($rootScope, $state, $auth) {

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
