app.controller('UsersCtrl', UsersCtrl);

UsersCtrl.$inject = ['$scope', '$state','$stateParams', 'admin','$controller','$compile', 'DTOptionsBuilder', 'DTColumnBuilder', '$filter'];

function UsersCtrl($scope, $state, $stateParams, admin, $controller, $compile, DTOptionsBuilder, DTColumnBuilder, $filter) {

  // Inject alert controller scope
  $controller('AlertCtrl', { $scope: $scope });
  var dtCtrl = this;

  /******************************************************
   *
   * DataTables funsies
   */

  /*
   * Starts building the DataTable when the function returns!
   * Fetches promise and waits until it is fulfilled
   */
  dtCtrl.dtOptions = DTOptionsBuilder.fromFnPromise(function() {
    return admin.getAllUsers();
  })
  .withPaginationType('simple_numbers')
  .withOption('createdRow',createdRow)
  .withOption('responsive', true);


  /*
   * Scoops up the data returned from the promise
   * Sets columns and fills data based off of that
   */
  dtCtrl.cols = [
    DTColumnBuilder.newColumn('id').withTitle('ID').withOption('responsivePriority',3),
    DTColumnBuilder.newColumn('name').withTitle('Name').withOption('responsivePriority',5),
    DTColumnBuilder.newColumn('email').withTitle('E-mail').withOption('responsivePriority',2),
    DTColumnBuilder.newColumn(null).withTitle('Admin').notSortable().renderWith(adminHTML).withOption('responsivePriority',7),
    DTColumnBuilder.newColumn(null).withTitle('Last Sign In').renderWith(lastSignIn).withOption('responsivePriority',6),
    DTColumnBuilder.newColumn(null).withTitle('IP Address').renderWith(ipAddress).withOption('responsivePriority',8),
    DTColumnBuilder.newColumn(null).withTitle('Created').renderWith(createdAt).withOption('responsivePriority',4),
    DTColumnBuilder.newColumn(null).withTitle('Actions').notSortable().renderWith(actionButtonHTML).withOption('responsivePriority',1),
    // DTColumnBuilder.newColumn(null).withTitle('').notSortable().renderWith(deleteButtonHTML).withOption('responsivePriority',1),
  ];
  dtCtrl.reloadData = reloadData;
  dtCtrl.dtInstance = {};


  function adminHTML(data) {

    if (data.admin) {
      return '<div class="text-center text-success"><i class="fa fa-check-circle fa-2x"></i></div>';
    }
    return '<div class="text-center text-danger"><i class="fa fa fa-times-circle fa-2x"></i></div>';
  }

  function deleteButtonHTML(data) {
    return '<button class="btn btn-danger" ng-click="deleteModal(' + data.id + ')"><i class="fa fa-trash-o fa-fw"></i>Delete User</button>';
  }

  function actionButtonHTML(data, type, full, meta) {
    return '<div class="text-center"><button class="btn btn-warning" ng-click="editModal(' + meta.row + ')"><i class="fa fa-edit fa-fw"></i></button>&nbsp;' +
    '<button class="btn btn-danger" ng-click="deleteModal(' + meta.row + ')"><i class="fa fa-trash-o fa-fw"></i></button></div>';
  }

  function lastSignIn(data) {
    if (data.last_sign_in_at === null) {
      return 'Has not yet signed in';
    }
    return $filter('date')(data.last_sign_in_at, 'EEEE, MMMM dd \'at\' hh:mm a');
  }

  function createdAt(data) {
    var d = new Date(data.created_at);
    return $filter('date')(data.created_at, 'EEEE, MMMM dd \'at\' hh:mm a');
  }

  function ipAddress(data) {
    if (!data.last_sign_in_ip) {
      return 'Has not yet signed in';
    }
    return data.last_sign_in_ip;
  }

  /**
   * ReloadData
   *
   * @returns {undefined}
   */
  function reloadData() {
    var resetPaging = true;
    var userPromise = admin.getAllUsers();
    userPromise.then(function(response) {
      dtCtrl.dtInstance.reloadData(response, resetPaging);
    });
  }

  /**
   * CreatedRow
   * Lets datatables know what row just got created
   * Recompiles the table so that a directive can get binded to the DT
   * It is used to bind the data to the directive
   * Without this ng-click will not work
   *
   * @param row
   * @param data
   * @param dataIndex
   * @returns {undefined}
   */
  function createdRow(row, data, dataIndex) {
    $compile(angular.element(row).contents())($scope);
  }

  $scope.register = function(user) {

    if (!$scope.registerUser.$valid) {
      $scope.addAlert('danger', 'Please correct the errors below and try submitting the form again.');
      return;
    }

    // Check whether form has not been filled out
    if ($scope.registerUser.$pristine) {
      $scope.addAlert('warning', 'Please fill out the form below before saving.');
      return;
    }

    if ($scope.user.isAdmin()) {
      var registerPromise = admin.registerUser(user);
      registerPromise.then(function(response) {
        if (typeof (response) === 'object') {
          $scope.addAlert('success', 'The user was successfully added. An e-mail has been sent with login instructions.');
          $scope.resetForm();
          reloadData();
        } else {
          $scope.addAlert('danger', 'Sorry but this user could not be added. Please try again.');
        }
      })
      .catch(function(response) {
        var error = response.data.errors.full_messages[0];
        $scope.addAlert('danger',error);
      });
      return;
    }
    $scope.addAlert('warning', 'Sorry, but you are not an admin.');
  };


  /**
   * ResetForm
   * clears the $scope.hub and sets the form to pristine(cleared)
   *
   * @returns {undefined}
   */
  $scope.resetForm = function() {
    $scope._user = {};
    $scope.registerUser.$setPristine();
  };

  $scope.deleteUser = function() {
    if ($scope.modalUser.id !== undefined) {

      var deletePromise = admin.deleteUser($scope.modalUser.id);
      deletePromise.then(function() {
        reloadData();
        $scope.addAlert('warning', 'The user was successfully deleted.');
      })
      .catch(function(response) {
        $scope.addAlert('danger','User could not be deleted.');
      });
    }
    $scope.showDeleteModal = false;
    $scope.modalUser = {};
  };

  $scope.deleteModal = function(_rowId) {
    var user = dtCtrl.dtInstance.DataTable.rows(_rowId).data()[0];
    if (user.id === undefined) {
      return;
    }
    $scope.showDeleteModal = !$scope.showDeleteModal;
    $scope.modalUser = user;
  };

  $scope.editModal = function(_rowId) {
    var user = dtCtrl.dtInstance.DataTable.rows(_rowId).data()[0];
    if (user.id === undefined)  {
      return;
    }
    $scope.showEditModal = !$scope.showEditModal;
    $scope.modalUser = user;
  };

  $scope.editUser = function() {
    console.log($scope.updateUser);
    // If (!$scope.updateUser.$valid) {
    //  $scope.addAlert('danger', 'User was not updated');
    //  return;
    // }
    if ($scope.modalUser.id !== undefined) {
      var updatePromise = admin.updateUser($scope.modalUser);
      updatePromise.then(function(response) {
        reloadData();
        $scope.addAlert('success', 'The user was successfully updated.');
      })
      .catch(function(response) {
        $scope.addAlert('danger',response.data.error.full_messages[0]);
      });
    }
    $scope.showEditModal = false;
    $scope.modalUser = {};
  };



  alerts = [];

  $scope.showDeleteModal = false; // Set to true to show the delete confirmation modal
  $scope.showEditModal = false; // Set true to show Edit Modal
  $scope.modalUser = {};
}
