define([], function(){
   function cuisineListController($scope){
   };

    return cuisineListController;
});

function CuisineListController( $scope, $http, AppConstants, AppUtils, RestRequests, ValidationService, ResponseMessage ) {

    $scope.searchParams = {};
    $scope.listInfo = {
        currentPage : 1
    };

    $scope.isServerError = false;

    $scope.isServerSuccess = false;
    $scope.successMessage = '';

    $scope.errorMessage = '';

    $scope.performSearch = function() {
        var requestName = AppConstants.adminServicePrefix + '/' + RestRequests.cuisineSearch;

        $http.post( requestName, $scope.searchParams )
            .success( function( data ) {

                $scope.isServerError = false;

                $scope.cuisineList = data.data.result;

                $scope.listInfo.totalItems = data.data.count;

            })
            .error( function( data ) {

                $scope.isServerSuccess = false;
                $scope.isServerError = true;

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
        $scope.searchParams = {};
        $scope.performSearch();
    };

};
