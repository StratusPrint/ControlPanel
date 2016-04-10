app.directive('setMinHeight', function($window) {
  return {
    link: function(scope, element, attrs) {
      element.css('min-height', $window.innerHeight + 'px');
    },
  };
});