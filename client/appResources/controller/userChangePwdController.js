define([], function() {
    function userChangePwdController($scope) {
    }
    return userChangePwdController;
});

function changePwdController ($scope, $location, DataStore, UserInfoProvider, AppConstants, RestRequests, $http){

	UserInfoProvider.handleUserStatus();

	$scope.user = {};
    $scope.err = {};
    $scope.errMsg = {};

    $scope.successMessage = '';
    $scope.errorMessage = '';

    $scope.isServerError = false;
    $scope.isServerSuccess = false;

    $scope.hasFieldError = function ( type, isFieldValue ) {

        if( isFieldValue ) {

            return type ? '' : 'noHeight';

        } else {

            return $scope.err[ type ] ? '' : 'noHeight';

        }
    };

    $scope.haveReceivedErrorFromServer = function() {
        return $scope.isServerError ? '' : 'noHeight';
    };

    $scope.haveReceivedSuccessFromServer = function(){
        return $scope.isServerSuccess ? '' : 'noHeight';
    };


    $scope.changePassword = function() {
        var requestName = AppConstants.loggedInUser + '/' + RestRequests.password;

        $http.put( requestName, $scope.user )
            .success( function( data ) {
                $scope.isServerError = false;
                $scope.isServerSuccess = true;

                $scope.err = {};
                $scope.errMsg = {};

                $scope.successMessage = data.msg;
            })
            .error( function( data ) {
                $scope.isServerSuccess = false;
                $scope.isServerError = true;

                $scope.err = data.err;
                $scope.errMsg = data.errMsg;

                $scope.errorMessage = data.msg;
            })
    }
}