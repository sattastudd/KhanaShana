define([], function(){
    function locationListController($scope){
    };

    return locationListController;
});

function LocationListController( $scope, $http, AppConstants, AppUtils, RestRequests, ValidationService, ResponseMessage ) {

    $scope.searchParams = {
        startIndex : 0
    };
    $scope.listInfo = {
        currentPage : 1
    };

    $scope.isServerError = false;

    $scope.isServerSuccess = false;
    $scope.successMessage = '';

    $scope.errorMessage = '';

    $scope.performSearch = function() {
        var requestName = AppConstants.adminServicePrefix + '/' + RestRequests.locationSearch;

        $http.post( requestName, $scope.searchParams )
            .success( function( data ) {

                $scope.isServerError = false;

                if( $scope.searchParams.startIndex === 0 ) {
                    $scope.locationList = data.data.result;
                    $scope.listInfo.totalItems = data.data.count;
                } else {
                    $scope.locationList = data.data;
                }

            })
            .error( function( data ) {

                $scope.isServerSuccess = false;
                $scope.isServerError = true;

                $scope.locationList = [];
                $scope.listInfo.totalItems = 0;

                $scope.errorMessage = data.msg;

            });
    };

    $scope.search = function () {

        var isNameBlank = AppUtils.isFieldBlank( $scope.searchParams.name ) ;

        if( isNameBlank ) {
            $scope.isServerSuccess = false;
            $scope.isServerError = true;

            $scope.errorMessage = ResponseMessage.errorMessage.noSearchCriteria;
        } else {
            if( !isNameBlank ){
                var result = ValidationService.isNameNotValid( $scope.searchParams.name, true );

                if( result.result ){
                    $scope.isServerError = true;
                    $scope.serverResponse = result.message;

                    return;
                }
            }

            $scope.performSearch();
        }

    };


    $scope.init = function() {

        if( angular.isUndefined( $scope.startIndex )) {
            $scope.startIndex = 0;
        }

        $scope.performSearch();
    };


    /* Getters */
    $scope.haveReceivedErrorFromServer = function() {
        return $scope.isServerError ? '' : 'noHeight';
    };

    $scope.haveReceivedSuccessFromServer = function(){
        return $scope.isServerSuccess ? '' : 'noHeight';
    };

    $scope.resetSearch = function() {
        $scope.searchParams = {
            startIndex : 0
        };
        $scope.performSearch();
    };

};
