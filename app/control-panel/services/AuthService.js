(function(angular) {

  function AuthService($auth, session) {

    /**
    * Check whether the user is logged in
    * @returns boolean
    *
    this.isLoggedIn = function isLoggedIn(){
      return session.getUser() !== null;
    };
    */
    /**
    * Log in
    *
    * @param credentials
    * @returns {*|Promise}
    */
    this.logIn = function(email, password) {
      return $auth.submitLogin(email, password)
        .then(function(response) {
          var data = response.data;
          //session.setUser(data.id);
          //session.setAccessToken(data.accessToken);
        }).catch(function(resp) {
          alert('Could not log in');
        });
    };

    /**
    * Log out
    *
    * @returns {*|Promise}
    */

  }

  // Inject dependencies
  AuthService.$inject = ['session','$auth'];

  // Export
  angular
    .module('ControlPanel')
    .service('AuthService', AuthService);

})(angular);
