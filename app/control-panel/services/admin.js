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
    return $http({
      method: 'GET',
      url: 'https://dev.api.stratusprint.com/v1/users',
    }).then(function(response) {
      return response.data;
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
    return $auth.submitRegistration(newUser);

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


  this.deleteUser = function(id) {
    return $http({
      method: 'DELETE',
      url: 'https://dev.api.stratusprint.com/v1/users/' + id,
    });
  };

  this.updateUser = function(user) {
    return $http({
      method: 'PATCH',
      url: 'https://dev.api.stratusprint.com/v1/users/' + user.id,
      data: { email: user.email,
              name: user.name,
              image: user.image,
              admin: user.admin,
      },
    });
  };
}
