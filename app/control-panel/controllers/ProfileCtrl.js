app.controller('ProfileCtrl', ProfileCtrl);

ProfileCtrl.$inject = ['$scope', '$auth'];

function ProfileCtrl($scope, $auth) {
  $scope.handleUpdateAccountBtnClick = function() {
    $auth.updateAccount($scope.updateAccountForm)
            .then(function(resp) {
              //handle success
            })

        .catch(function(resp) {
          alert('Error ' + resp.data);
          //error resp
        });
  };
}
