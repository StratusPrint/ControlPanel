app.controller('ProfileCtrl', ProfileCtrl);

ProfileCtrl.$inject = ['$scope', '$auth'];

function ProfileCtrl($scope, $auth) {
  $scope.save = function(profile) {
    console.log(profile);
    $auth.updateAccount(profile)
      .then(function(resp) {
        console.log(resp);
        // Handle success
      })
      .catch(function(resp) {
        console.log(resp);
        // Error resp
      });
  };
}
