app.controller('navCtrl', ['$scope', '$location', '$auth',function($scope, $location, $auth) {
  $scope.signout = function() {
    $auth.signOut()
    .then(function(resp) {
      alert('You were successfully logged out');
      $location.path('/');
    })
    .catch(function(resp) {
      // handle error response
      alert('You were successfully logged out');
      console.log(resp);
    });
  };
}]);
