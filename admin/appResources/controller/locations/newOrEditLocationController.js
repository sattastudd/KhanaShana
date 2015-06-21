define([], function(){
    function newOrEditLocationController( $scope ) {};
    return newOrEditLocationController;
});

function NewLocationController( $scope, $http, $location, AppConstants, AppUtils, DataStore, RestRequests, ValidationService ) {

    $scope.isServerError = false;

    $scope.isServerSuccess = false;
    $scope.successMessage = '';

    $scope.errorMessage = '';

    $scope.err = {};
    $scope.errMsg = {};

    $scope.hasAnyValidationFailed = false;

    $scope.init = function() {
        var isEdit = DataStore.readAndRemove( 'isLocationEdit' );

        if( isEdit ) {
            $scope.isEdit = true;
            $scope.location = DataStore.readAndRemove( 'toEdit' );
            $scope.originalLocation = {
                locationName : $scope.location.name,
                isOnHomePage : $scope.location.isOnHomePage
            };
        } else {

            $scope.location = {
                name : '',
                isOnHomePage : false
            };

        }
    };

    $scope.haveReceivedErrorFromServer = function() {
        return $scope.isServerError ? '' : 'noHeight';
    };

    $scope.haveReceivedSuccessFromServer = function(){
        return $scope.isServerSuccess ? '' : 'noHeight';
    };

    $scope.hasFieldError = function( type ) {
        return $scope.err[ type ] ? '' : 'noHeight';
    };

    $scope.addNewLocation = function ( ){
        var requestName = AppConstants.adminServicePrefix + '/' + RestRequests.newLocation;

        console.log( $scope.location.isOnHomePage );

        var isNameNotValid = ValidationService.isNameNotValid( $scope.location.name, true );
        var isOnHomePageNot = ValidationService.isBooleanNotValid( "" + $scope.location.isOnHomePage, true );

        if( isNameNotValid.result ) {
            $scope.err.name = true;
            $scope.errMsg.name = isNameNotValid.message;

            $scope.hasAnyValidationFailed = true;
        } else {
            $scope.err.name = false;
        }

        if( isOnHomePageNot.result ) {
            $scope.err.isOnHomePage = true;
            $scope.errMsg.isOnHomePage = isOnHomePageNot.message;

            $scope.hasAnyValidationFailed = true;
        } else {
            $scope.err.isOnHomePage = false;
        }

        if( !$scope.isEdit ) {

            if ($scope.hasAnyValidationFailed) {
                return;
            } else {
                $http.post(requestName, $scope.location)
                    .success(function (data) {
                        $scope.isServerError = false;
                        $scope.isServerSuccess = true;

                        $scope.successMessage = data.msg;
                    })
                    .error(function (data) {
                        if (AppUtils.isObjectEmpty(data.err)) {
                            $scope.isServerError = true;
                            $scope.isServerSuccess = false;

                            $scope.errorMessage = data.msg;
                        } else {
                            $scope.err = data.err;
                            $scope.errMsg = data.errMsg;
                        }
                    });
            }
        } else {

            var putRequest = AppConstants.adminServicePrefix + '/' + RestRequests.newLocation + '/' + $scope.originalLocation.locationName;

            var payLoad = {
                old : $scope.originalLocation,
                new : $scope.location
            };

            payLoad.new.locationName = payLoad.new.name;

            $http.put( putRequest, payLoad )
                .success( function( data ) {
                    $scope.isServerError = false;
                    $scope.isServerSuccess = true;

                    $scope.successMessage = data.msg;
                })
                .error( function( data ) {
                    if (AppUtils.isObjectEmpty(data.err)) {
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