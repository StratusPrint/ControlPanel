app.service('hub', HubService);

HubService.$inject = ['$http', '$state', 'user'];

function HubService($http, $state, user) {
  /**
   * GetAllHubs
   * Fetches every hub from the database
   *
   * @returns {JSON}
   */
  this.getAllHubs = function() {
    return $http({
      method: 'GET',
      url: 'https://dev.api.stratusprint.com/v1/hubs',
    }).then(function successCallback(response) {
      return response.data;
    }, function errorCallback(response) {
      // Error response right here
    });
  };

  /**
   * AddHub
   * Takes in a hub object that consists of a friendly_id, ip, hostname, location, and desc
   * All of type string
   *
   * @param hub
   * @returns {JSON} response
   */
  this.addHub = function(hub) {
    return $http({
      method: 'POST',
      url: 'https://dev.api.stratusprint.com/v1/hubs',
      data: {hub: hub},
    }).then(function successCallback(response) {
      return response.data;

    }, function errorCallback(response) {

      return response.data;
    });
  };

  this.deleteHub = function(id) {
    return $http({
      method: 'DELETE',
      url: 'https://dev.api.stratusprint.com/v1/hubs/' + id,
    }).then(function successCallback(response) {
      console.log('Success: ' + response.data);
      return response.data;

    }, function errorCallback(response) {
      console.log('Error: ' + response.data);
      return response.data;
    });
  };
}