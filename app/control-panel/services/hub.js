app.service('hub', HubService);

HubService.$inject = ['$http', '$state', 'user'];

function HubService($http, $state, user) {


  /**
   * @return {JSON} A JSON representation of all the hubs
  */
  this.getAllHubs = function() {
    $http({
      method: 'GET',
      url: 'https://dev.api.stratusprint.com/v1/hubs',
    }).then(function successCallback(response) {
      // Success right here
    }, function errorCallback(response) {
      // Error response right here
    });
  };

  this.addHub = function(hub) {
    $http({
      method: 'POST',
      url: 'https://dev.api.stratusprint.com/v1/hubs',
      data: hub,
    }).then(function successCallback(response) {
      console.log(response);
      // Success right here
    }, function errorCallback(response) {
      console.log(response);
      // Error response right here
    });
  };
}
