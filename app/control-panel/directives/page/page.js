// To set the Title of each view
app.factory('Page', function() {
  var title = 'Dashboard'; // Default
  return {
    title: function() { return title; },
    setTitle: function(newTitle) { title = newTitle; },
  };
});