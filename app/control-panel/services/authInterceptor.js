// jscs:disable

app.service('authInterceptor', AuthInterceptor);

AuthInterceptor.$inject = ['$q', '$injector'];

function AuthInterceptor($q, $injector) {
    var service = this;

    service.responseError = function(response) {
        if (response.status == 401) {
            var stateService = $injector.get('$state');
            var authService = $injector.get('auth');
            authService.logout();
            stateService.go('login');
        }
        return $q.reject(response);
    };
}
