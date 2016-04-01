app.directive('navigation', function() {
  return {
    restrict: 'E',
    scope: {},
    templateUrl: 'views/navigation/navigationView.html',
    link: function(scope, elem, attrs) {
      angular.element('#side-menu').metisMenu();
    },
    controller: 'NavigationCtrl'
  };
});
