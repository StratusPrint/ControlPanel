// jscs:disable

app.service('authInterceptor', AuthInterceptor);

AuthInterceptor.$inject = ['$q', '$injector'];

function AuthInterceptor($q, $injector) {
    var service = this;

    service.responseError = function(response) {
        var stateService = $injector.get('$state');
        var authService = $injector.get('auth');
        if (response.status === 401) {
            authService.logout();
            stateService.go('login');
        } else if (response.status === 404 && (stateService.current.name === 'dashboard.listHubs' || stateService.current.name === 'dashboard.viewHub' || stateService.current.name === 'dashboard.printer')) {
            stateService.go('dashboard.404');
        }
        return $q.reject(response);
    };
}
