define([], function(){
    function newOrEditLocationController( $scope ) {};
    return newOrEditLocationController;
});

function NewLocationController( $scope, $http, $location, AppConstants, AppUtils, RestRequests, ValidationService ) {

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

    $scope.location = {
        name : ''
    };

    $scope.hasFieldError = function( type ) {
        return $scope.err[ type ] ? '' : 'noHeight';
    };

    $scope.addNewLocation = function ( ){
        var requestName = AppConstants.adminServicePrefix + '/' + RestRequests.newLocation;

        var isNameNotValid = ValidationService.isNameNotValid( $scope.location.name, true );

        if( isNameNotValid.result ) {
            $scope.err.name = true;
            $scope.errMsg.name = isNameNotValid.message;
        } else {

        $http.post( requestName, $scope.location )
            .success( function( data ) {
                $scope.isServerError = false;
                $scope.isServerSuccess = true;

                $scope.successMessage = data.msg;
            })
            .error( function( data ) {
                if( AppUtils.isObjectEmpty( data.err )) {
                    $scope.isServerError = true;
                    $scope.isServerSuccess = false;

                    $scope.errorMessage = data.msg;
                } else {
                    $scope.err = data.err;
                    $scope.errMsg = data.errMsg;
                }
            });
        }
    };

    $scope.goBack = function() {
        $location.path( '/dashboard');
    }
};