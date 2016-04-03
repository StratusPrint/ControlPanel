app.controller('RegisterCtrl', RegisterCtrl);

RegisterCtrl.$inject = ['$scope', '$auth'];

function RegisterCtrl($scope, $auth) {
    $scope.register = function() {
        $auth.submitRegistration($scope.registerForm)
            .then(function(resp) {
                // handle success response
                console.log(resp);
            })
            .catch(function(resp) {
                // handle error response
                console.log(resp);
                console.log('Obviously got an error response!');
                $scope.registerErrorMessage = 'Sorry, but uh we couldn\'t find you, try again';
            });
    };
}
