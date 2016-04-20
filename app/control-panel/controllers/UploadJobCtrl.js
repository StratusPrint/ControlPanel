/*jshint loopfunc: true */

app.controller('UploadJobCtrl', UploadJobCtrl);

UploadJobCtrl.$inject = ['$scope', '$state', '$stateParams', '$timeout', 'Upload'];

function UploadJobCtrl($scope, $state, $stateParams, $timeout, Upload) {
  $scope.uploadFiles = function(files, errFiles) {
    $scope.files = files;
    $scope.errFiles = errFiles;

    angular.forEach(files, function(file) {
        Upload.base64DataUrl(file).then(function(url) {

          var extension = file.name.split('.').pop();

          if (extension === 'stl') {
            url = url.substr(0, 5) + 'application/stl' + url.substr(5);
          } else if (extension === 'gcode') {
            url = url.substr(0, 5) + 'application/gcode' + url.substr(5);
          }

          file.upload = Upload.http({
            url: 'https://dev.api.stratusprint.com/v1/printers/12/jobs',
            headers: {'Content-Type': 'application/json' },
            data: {
              model: url,
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
