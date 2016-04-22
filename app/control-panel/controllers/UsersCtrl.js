app.controller('UsersCtrl', UsersCtrl);

UsersCtrl.$inject = ['$scope', '$state','$stateParams', 'admin'];

function UsersCtrl($scope, $state, $stateParams, admin) {

  /*
  * Load the Users from the Database
  */
  function loadUsers() {
    var userPromise = admin.getAllUsers();
    userPromise.then(function(response) {
      $scope.users = []; // To empty before reloading
      var i;
      for (i = 0 ; i < response.length; i++) {
        $scope.users.push(response[i]);
      }
    }).catch(function(response) {
      addErrorAlert(response.data);
    });
  }

  $scope.register = function(user) {

    var registerPromise = admin.registerUser(user);
    registerPromise.then(function(response) {
      addSuccessAlert('User Successfully Registered!');
      loadUsers();
    })
    .catch(function(response) {
      var errors = response.data.errors.full_messages;
      var i;
      for (i = 0 ; i < errors.length ;i++) {
        addErrorAlert(errors[i]);
      }
    });
  };

  $scope.deleteUser = function() {
    if ($scope.modalUserID >= 0) {
      var deletePromise = admin.deleteUser(_id);
      deletePromise.then(function() {
        loadUsers();
        addSuccessAlert('User Deleted!');
      })
      .catch(function() {

      });
    }
    $scope.modalUserID = -1;



  };

  $scope.deleteModal = function(_id) {
    $scope.showDeleteModal = !$scope.showDeleteModal;
    $scope.modalUserID = _id;
  };


  alerts = [];

  $scope.showDeleteModal = false; // Set to true to show the delete confirmation modal
  $scope.showEditModal = false; // Set true to show Edit Modal
  $scope.modalUserID = -1;
  $scope.users = [];
  loadUsers();

}
