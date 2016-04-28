// jscs:disable

app.filter('door', function() {
    return function(input) {
        if(input === 0 || input === '0') { return 'Open'; }
        if(input === 1 || input === '1') { return 'Closed'; }
        return 'Unknown';
    };
});
