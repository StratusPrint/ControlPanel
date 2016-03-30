app.controller('profileCtrl', function($scope, $auth) {
  $scope.handleUpdateAccountBtnClick = function() {
    $auth.updateAccount($scope.updateAccountForm)
      .then(function(resp) {
        alert("Success" +resp.data); //handle success
        })

        .catch(function(resp) {
        alert("Error " +resp.data);
          //error resp
        });
  };
});
