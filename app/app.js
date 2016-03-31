var app = angular.module('ControlPanel', ['ui.router', 'ng-token-auth']);
var user;

/*  function($routeProvider) {
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
        controller: 'mainCtrl',
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

      when('/profile',{
        templateUrl: 'components/profile/profileView.html',
        controller: 'profileCtrl',
        resolve: {
          auth: ['$auth', function($auth) {
            var aut = $auth.validateUser();
            return aut;
          }]
        }
      }).

      otherwise({
        redirectTo: '/'
      });

  }
]);
*/

app.config(function($stateProvider, $urlRouterProvider) {
  //
  // For any unmatched url, redirect to /dashboard
  $urlRouterProvider.otherwise("/dashboard");
  //
  // Now set up the states
  //When registering a new state you have to add a url too, otherwise it wont register
  //with the urlRouterProvider
  $stateProvider
      // this state will be visible to everyone
      .state('/login', {
        url: '/login',
        templateUrl: 'components/login/loginView.html',
        controller: 'loginCtrl'
      })
      .state('/dashboard',{
        url:'/dashboard',
        templateUrl: 'components/dashboard/dashboardView.html',
        controller: 'mainCtrl',
        resolve: {
          auth: ['$auth', function($auth) {
            var aut = $auth.validateUser();
            return aut;
          }]
        }
      })
      .state('/register',{
        url: '/register',
        templateUrl: 'components/register/registerView.html',
        controller: 'registerCtrl'
      })
      .state('/profile',{
        url: '/profile',
        templateUrl: 'components/profile/profileView.html',
        controller: 'profileCtrl',
        resolve: {
          auth: ['$auth', function($auth) {
            var aut = $auth.validateUser();
            return aut;
          }]
        }
      });
  
});

app.config(function($authProvider) {
  $authProvider.configure({
    apiUrl: 'https://dev.api.stratusprint.com/v1',
    tokenValidationPath:     '/auth/validate_token',
    signOutUrl:              '/auth/sign_out',
    emailRegistrationPath:   '/auth',
    accountUpdatePath:       '/auth',
    confirmationSuccessUrl:  '/dashboard',
    emailSignInPath:         '/auth/sign_in',
    storage:                 'cookies',
    forceValidateToken:      false,
    //apiUrl: 'http://localhost:8081/v1'
    handleLoginResponse: function(response) {
      SetUser(response);
      return response;
    }
  });
});

app.controller('mainCtrl', function($scope) {
  $scope.message =
    'This is the main controller and can be on every page, if we want!';
});

/* Setting up authentication, redirections, and signout */
app.run(function($rootScope, $state, $auth) {
  $rootScope.$on('auth:invalid',function(e) {
    //$location.path('/login');
    $state.go('/login');
  });

  $rootScope.$on('auth:login-success',function(e) {
    $rootScope.user = GetUser();
    //$location.path('/dashboard');
    $state.go('/dashboard');
  });

  $rootScope.$on('auth:logout-error', function(ev, reason) {
  });

  $rootScope.$on('auth:account-update-success', function(ev) {
      alert("Your account has been successfully updated!");
  });

});

function SetUser(userInfo) {
  user = {
    id:userInfo.data.id,
    email:userInfo.data.email,
    name:userInfo.data.name,
    nickname:userInfo.data.nickname,
    image:userInfo.data.image,
    admin:userInfo.data.admin
  }; 
  if (user.image === null) {
    console.log("going here?");
    user.image = "assets/img/avatar.png";
  }
  if (user.admin === null) {
    user.admin = false;
  }

  /*  if (user.admin === false) {
      alert("Chagne your password dick");
      } */
}

function GetUser() {
  return user;
}
