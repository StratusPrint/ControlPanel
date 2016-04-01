app.directive('navigation', function() {
    return {
        restrict: 'E',
        scope: {},
        templateUrl: 'control-panel/directives/navigation/navigation.html',
        link: function(scope, elem, attrs) {
            angular.element('#side-menu').metisMenu();
        },
        controller: 'NavigationCtrl'
    };
});
