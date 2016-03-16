theApp.controller('loginCtrl', function($scope,$auth) {
	$scope.login = function() {
	    $auth.submitLogin($scope.loginForm)
	    .then(function(resp) {
        alert('Welcome!');
	      // handle success response
	      console.log("Logged in!?");
	    })
	    .catch(function(resp) {
	      // handle error response
	      console.log("Obviously got an error response!");
	      $scope.loginErrorMessage = "Sorry, but uh we couldn't find you, try again";
	    });
	};
});


