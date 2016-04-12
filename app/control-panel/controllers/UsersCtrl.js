app.controller('UsersCtrl', UsersCtrl);

UsersCtrl.$inject = ['$scope', '$state','$stateParams', 'admin'];

function UsersCtrl($scope, $state, $stateParams, admin) {

  /*
  * Load the Users from the Database
  */
  function loadUsers() {
    var userPromise = admin.getAllUsers();
    userPromise.then(function(response) {

      $scope.users = response;

    }).catch(function(response) {

    });
  }

  $scope.register = function(user) {
    console.log(user);
    var RegisterPromise = admin.registerUser(user);
    RegisterPromise.then(function(response) {
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



  function addSuccessAlert(alert) {
    $scope.alerts.push({type: 'success', msg: alert});
  }

  function addErrorAlert(alert) {
    $scope.alerts.push({type: 'danger', msg: alert});
  }

  $scope.closeAlert = function(index) {
    $scope.alerts.splice(index, 1);
  };
  $scope.alerts = [];
  loadUsers();

}