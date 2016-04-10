app.controller('UsersCtrl', UsersCtrl);

UsersCtrl.$inject = ['$scope', '$state','$stateParams', 'admin'];


function UsersCtrl($scope, $state, $stateParams, admin) {

  $scope.users = admin.getAllUsers();

}