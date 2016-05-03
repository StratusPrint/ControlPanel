app.controller('NavigationCtrl', NavigationCtrl);

app.$inject = ['$scope', '$location', '$auth'];

function NavigationCtrl($scope, $location, $auth) {
  $scope.signout = function() {
    $auth.signOut()
            .then(function(resp) {
              alert('You were successfully logged out');
              $location.path('/');
            })
            .catch(function(resp) {
              // Handle error response
              alert('You were successfully logged out');
              console.log(resp);
            });
  };
}
