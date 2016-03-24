app.directive('navigation', function() {
  return {
    restrict: 'E',
    scope : { },
    templateUrl : 'shared/navigation/navigationView.html',
    link: function(scope, elem, attrs) {
    	angular.element('#side-menu').metisMenu(); 
    }
  };
});