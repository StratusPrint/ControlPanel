app.service('hub', HubService);

HubService.$inject = ['$http', '$state', 'user'];

function HubService($http, $state, user) {


  /**
   * @return {JSON} A JSON representation of all the hubs
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

  this.addHub = function(hub) {
    $http({
      method: 'POST',
      url: 'https://dev.api.stratusprint.com/v1/hubs',
      data: {hub: hub},
    }).then(function successCallback(response) {
      console.log(response);
      // Success right here
    }, function errorCallback(response) {
      console.log(hub);
      console.log(response);
      // Error response right here
    });
  };
}
