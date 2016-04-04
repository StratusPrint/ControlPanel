app.service('auth', AuthService);

AuthService.$inject = ['$auth', '$rootScope', '$state', 'user'];

function AuthService($auth, $rootScope, $state, user) {
  /**
   * Listen for state changes. If the new state requires that the
   * user has to be logged in, and the user is in fact not, then
   * force redirect them to the login page instead.
   */
  $rootScope.$on('$stateChangeStart', function(event, toState, toParams) {
    var requireLogin = toState.data.requireLogin;

    if (requireLogin && !user.isAuthenticated()) {
      event.preventDefault();
      $state.go('login');
    }
  });

  /**
   * Authenticate a user. Upon successful login, this will
   * also set the current user by calling the user service,
   * and then finally redirect to the dashboard.
   *
   * @param  {String} email    The e-mail address of the user
   * @param  {String} password The password of the user
   */
  this.login = function(email, password) {
    var login = $auth.submitLogin(email, password);
    login.then(function(resp) {
      console.log(resp);
      user.set(resp);
    });
    return login;
  };

  /**
   * De-authenticate current user. This method does not take any
   * arguments. This will also destroy the current user by calling
   * the user service.
   */
  this.logout = function() {
    var logout = $auth.signOut();
    logout.then(function(resp) {
      console.log(resp);
      user.destroy();
    });
    return logout;
  };

  /**
   * Change an authenticated user's account info. Upon successful login,
   * this will update the current user by calling the user service.
   *
   * @param  {Object} data An object that contains valid params for the user model
   */
  this.updateAccount = function(data) {
    var update = $auth.updateAccount(data);
    update.then(function(resp) {
      console.log(resp);
      user.set(resp);
    });
    return update;
  };
}
