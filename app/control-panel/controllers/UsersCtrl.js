app.controller('UsersCtrl', UsersCtrl);

UsersCtrl.$inject = ['$scope', '$state','$stateParams', 'admin'];

function UsersCtrl($scope, $state, $stateParams, admin) {

  var userPromise = admin.getAllUsers();
  userPromise.then(function(response) {

    $scope.users = response;

  }).catch(function(response) {
    console.log('Error' + response);
  });

  $scope.registerUser = function(_user) {
    console.log('User' + _user);
    var resp = admin.registerUser(_user);
    console.log(resp);
  };


}