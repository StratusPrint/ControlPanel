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
    console.log(user);
    var registerPromise = admin.registerUser(user);
    registerPromise.then(function(response) {
      addSuccessAlert('User Successfully Registered!');
      loadUsers();
    })
    .catch(function(response) {
      // Var errors = response.data.errors.full_messages;
      var errors = [];
      var i;
      for (i = 0 ; i < errors.length ;i++) {
        addErrorAlert(errors[i]);
      }
    });
  };

  $scope.delete = function(_id) {
    var deletePromise = admin.deleteUser(_id);
    deletePromise.then(function() {
      loadUsers();
      addSuccessAlert('User Deleted!');
    })
    .catch(function() {

    });



  };

  function addSuccessAlert(alert) {
    alerts.push({type: 'success', msg: alert});
  }

  function addErrorAlert(alert) {
    alerts.push({type: 'danger', msg: alert});
  }

  $scope.closeAlert = function(index) {
    alerts.splice(index, 1);
  };
  alerts = [];

  $scope.showModal = false;
  $scope.toggleModal = function() {
    $scope.showModal = !$scope.showModal;
    console.log($scope.showModal);
  };


  $scope.users = [];


  loadUsers();

}
