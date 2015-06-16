define([], function(){
    function locationListController($scope){
    };

    return locationListController;
});

function LocationListController( $scope, $http, $modal, AppConstants, AppUtils, RestRequests, ValidationService, ResponseMessage ) {

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

    $scope.deleteLocation = function( location ) {
        var modalInstance = $modal.open({
            template : angular.element( document.getElementById('deleteModal')).html(),
            size : 'md',
            controller : 'ModalInstanceController',
            resolve : {
                title : function () {
                    return 'Location';
                }
            },
            backdrop : 'static'
        });

        modalInstance.result.then( function( data ) {
            if( data === 'deleteIt' ) {
                console.log('Location should be deleted now' );
            }
        });
    };

};

function ModalInstanceController( $scope, $modalInstance, title ) {
    console.log( title );
    $scope.title = title;

    $scope.ok = function(){
        $modalInstance.close('deleteIt');
    };

    $scope.cancel = function (){
        $modalInstance.dismiss('no' );
    };
};