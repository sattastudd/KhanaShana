define([], function( $scope ) {
    function pendingDetailsRestaurantListController(){
    };
    return pendingDetailsRestaurantListController;
});

function PendingDetailsRestaurantListController( $scope, $http, $location, AppConstants, AppUtils, RestRequests, DataStore, ResponseMessage, ValidationService){
    var requestName = AppConstants.adminServicePrefix + '/' + RestRequests.searchRestaurants;;

    $scope.restaurantList = [];

    $scope.listInfo = {
        currentPage : 1
    };

    $scope.searchParams = {
        approved : false
    };

    $scope.isServerError = false;

    $scope.isServerSuccess = false;
    $scope.successMessage = '';

    $scope.errorMessage = '';


    $scope.globalPageSize = DataStore.getData( 'globalPageSize' );

    /* Called by controller to initiate search automatically. */
    $scope.init = function () {
        $scope.search();
    };

    /* Initiate Search */
    $scope.search = function () {

        $http.post(requestName, $scope.searchParams)
            .success(function (data) {
                console.log(data);

                $scope.restaurantList = data.data.result;

                if (typeof data.data.count !== 'undefined')
                    $scope.listInfo.totalItems = data.data.count;
            })
            .error(function (data) {
                $scope.isServerSuccess = false;
                $scope.isServerError = true;

                $scope.errorMessage = data.msg;
            });
    };

    /* Actions */
    $scope.searchRestaurants = function () {
        var isNameBlank = AppUtils.isFieldBlank( $scope.searchParams.name ) ;
        var isLocalityBlank = AppUtils.isFieldBlank( $scope.searchParams.locality );

        if( isNameBlank && isLocalityBlank ) {
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

            if( !isLocalityBlank ) {
                var result = ValidationService.isNameNotValid( $scope.searchParams.locality, true );

                if( result.result ) {
                    $scope.isServerError = true;
                    $scope.serverResponse = result.message;

                    return;
                }
            }

            $scope.search();
        }
    };

    /* What to do on page click */
    $scope.getRestaurants = function () {
        $scope.searchParams.startIndex = (( $scope.listInfo.currentPage - 1 ) * $scope.globalPageSize ) + 1;
        $scope.search();
    };

    /* Reset Search */
    $scope.resetSearch = function(){
        $scope.searchParams = {
            approved : false
        };

        $scope.search();
    };

    $scope.editRestaurant = function( restaurant ) {

        console.log( restaurant );

        DataStore.storeData( 'isRestaurantEdit', true );
        DataStore.storeData( 'toEditRestaurant', restaurant.slug );

        $location.path( 'restaurants/new' );
    };

    /* Getters */
    $scope.haveReceivedErrorFromServer = function() {
        return $scope.isServerError ? '' : 'noHeight';
    };

    $scope.haveReceivedSuccessFromServer = function(){
        return $scope.isServerSuccess ? '' : 'noHeight';
    };
};