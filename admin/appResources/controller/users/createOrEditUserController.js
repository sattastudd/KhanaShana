define([], function($scope){
	function createOrEditUserController(){
	};
	return createOrEditUserController;
});

function CreateOrEditUserController( $scope, $http, DataStore, AppConstants, RestRequests ) {
    $scope.pageHeading = '';
    $scope.buttonText = '';
    $scope.isEdit = false;

    $scope.user = {};

    $scope.isServerError = false;

    $scope.isServerSuccess = false;
    $scope.successMessage = '';

    $scope.errorMessage = '';

    $scope.err = {};
    $scope.errMsg = {};

    $scope.haveReceivedErrorFromServer = function() {
        return $scope.isServerError ? '' : 'noHeight';
    };

    $scope.haveReceivedSuccessFromServer = function(){
        return $scope.isServerSuccess ? '' : 'noHeight';
    };

    /*Init Method to check if its a create or Edit Page.*/
    $scope.init = function() {
        $scope.isEdit = DataStore.readAndRemove( 'isUserEdit' );

        if( $scope.isEdit ){
            $scope.pageHeading = 'Edit User';
            $scope.buttonText = 'Save Changes';

            $scope.user = DataStore.readAndRemove( 'toEditUser' );

            $scope.user.oldEmail = $scope.user.email;
        } else {
            $scope.pageHeading = 'Create New User';
            $scope.buttonText = 'Create User';
        }
    };

    /*Form Actions*/
    $scope.createOrEditUser = function () {
        var requestName = AppConstants.adminServicePrefix + '/' + RestRequests.createEditUser;

        $scope.user.isInsert = !$scope.isEdit;

        $http.post( requestName, $scope.user )
            .success( function( data ){
                $scope.isServerError = false;
                $scope.isServerSuccess = true;

                $scope.successMessage = data.msg;
            })
            .error( function( data ) {
                console.log( data );

                $scope.isServerSuccess = false;
                $scope.isServerError = true;

                $scope.errorMessage = data.msg;

                $scope.err = data.err;
                $scope.errMsg = data.errMsg;
            });
    };

    /* Method to reset user's password. */
    $scope.resetUserPassword = function () {
        var requestName = AppConstants.adminServicePrefix + '/' + RestRequests.userPasswordReset;

        var payLoad = {
            email : $scope.user.oldEmail
        };

        $http.post( requestName, payLoad )
            .success( function( data ){
                $scope.isServerError = false;
                $scope.isServerSuccess = true;

                $scope.successMessage = data.msg;
            })
            .error( function( data ){
                $scope.isServerSuccess = false;
                $scope.isServerSuccess = true;

                $scope.errorMessage = data.msg;

                $scope.err = data.err;
                $scope.errMsg = data.errMsg;
            })
    };

    /* Validation Getters */
    $scope.hasFieldError = function ( type ) {
        return $scope.err[ type ] ? '' : 'noHeight';
    };

};