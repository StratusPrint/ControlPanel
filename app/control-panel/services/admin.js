app.service('admin', AdminService);

AdminService.$inject = ['$http', '$state', 'user', '$auth'];


function AdminService($http, $state, user, $auth) {
  /**
   * GetAllUsers
   * Gets all the Users currently registered
   *
   * @returns {promise}
   */
  this.getAllUsers = function() {
    $http({
      method: 'GET',
      url: 'https://dev.api.stratusprint.com/v1/users',
    }).then(function successCallback(response) {
      return response.data;
    }, function errorCallback(response) {
      // Error response right here
    });
  };

  /**
   * Register User
   * Takes in a User object and registers them
   *
   * @param user
   *
   */
  this.registerUser = function(newUser) {
    $auth.submitRegistration(newUser)
        .then(function(resp) {
          // Handle success response
        })
        .catch(function(resp) {
          // Handle error response
        });
  };




  /**
   * GetUser
   * Gets the User info with User ID, id
   *
   * @param id
   * @returns users data
   */
  this.getUser = function(id) {
    $http({
      method: 'GET',
      url: 'https://dev.api.stratusprint.com/v1/users/' + id,
    }).then(function successCallback(response) {
      return response.data;

    }, function errorCallback(response) {
      return response.data;
    });
  };
}
