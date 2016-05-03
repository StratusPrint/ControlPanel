app.controller('MainCtrl', MainCtrl);

MainCtrl.$inject = ['$scope', 'Page'];

function MainCtrl($scope, Page) {
  $scope.Page = Page;
}