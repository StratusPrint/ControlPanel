/*jshint loopfunc: true */
app.controller('UploadJobCtrl', UploadJobCtrl);

UploadJobCtrl.$inject = ['$scope', '$state', '$stateParams', '$timeout', 'Upload'];

function UploadJobCtrl($scope, $state, $stateParams, $timeout, Upload) {
  var printerId = $stateParams.printerId;
  $scope.files = [];
  $scope.errFiles = [];

  $scope.uploadFiles = function(files, errFiles) {
    if ($stateParams.printerId === undefined) {
      printerId = $scope.printer.id;
    }

    angular.forEach(files, function(file) {
      $scope.files.unshift(file);
      Upload.base64DataUrl(file).then(function(url) {

        var name = file.name.substring(0, file.name.lastIndexOf('.'));
        var extension = file.name.split('.').pop().toLowerCase();

        if (extension === 'stl') {
          url = url.substr(0, 5) + 'application/stl' + url.substr(5);
        } else if (extension === 'gcode') {
          url = url.substr(0, 5) + 'application/gcode' + url.substr(5);
        } else if (extension === 'gco') {
          url = url.substr(0, 5) + 'application/gco' + url.substr(5);
        } else if (extension === 'g') {
          url = url.substr(0, 5) + 'application/g' + url.substr(5);
        }

        file.upload = Upload.http({
          url: 'https://dev.api.stratusprint.com/v1/printers/' + printerId + '/jobs',
          headers: {'Content-Type': 'application/json' },
          data: {
            model: url,
            model_file_name: name,
          },
        });

        file.upload.then(function(response) {
          $timeout(function() {
            file.result = response.data;
          });
        }, function(response) {
          if (response.status > 0) {
            $scope.errorMsg = response.status + ': ' + response.data;
          }
        }, function(evt) {
          file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
        });

      });
    });
  };
}
