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
            templateUrl: 'views/login/loginView.html',
            controller: 'LoginCtrl'
        })
        .state('/dashboard', {
            url: '/dashboard',
            templateUrl: 'views/dashboard/dashboardView.html',
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
            templateUrl: 'views/register/registerView.html',
            controller: 'RegisterCtrl'
        })
        .state('/profile', {
            url: '/profile',
            templateUrl: 'views/profile/profileView.html',
            controller: 'ProfileCtrl',
            resolve: {
                auth: ['$auth', function($auth) {
                    var aut = $auth.validateUser();
                    return aut;
                }]
            }
        });
    $urlRouterProvider.otherwise('/dashboard');
});

app.config(function($authProvider) {
    $authProvider.configure({
        apiUrl: 'https://dev.api.stratusprint.com/v1',
        tokenValidationPath: '/auth/validate_token',
        signOutUrl: '/auth/sign_out',
        emailRegistrationPath: '/auth',
        accountUpdatePath: '/auth',
        confirmationSuccessUrl: '/dashboard',
        emailSignInPath: '/auth/sign_in',
        storage: 'cookies',
        forceValidateToken: false,
        //apiUrl: 'http://localhost:8081/v1'
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
        $rootScope.user = GetUser();
        $state.go('/dashboard');
    });

    $rootScope.$on('auth:logout-error', function(ev, reason) {});

    $rootScope.$on('auth:account-update-success', function(ev) {
        alert('Your account has been successfully updated!');
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
