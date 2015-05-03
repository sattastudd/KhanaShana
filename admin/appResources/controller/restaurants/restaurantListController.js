define([], function($scope) {
    function restaurantController() {
    };

    return restaurantController;
});

function RestaurantListController($scope, $http, AppConstants, RestRequests){
    var requestName = AppConstants.adminServicePrefix + '/' + RestRequests.restaurantList;

    $scope.restaurantList = [];

    $scope.listInfo = {
        currentPage : 1
    };

    $http.post(requestName, {})
        .success( function( data ) {
            console.log( data );

            $scope.restaurantList = data.data.result;

            if( typeof data.data.count !== 'undefined' )
                $scope.listInfo.totalItems = data.data.count;
        })
        .error( function( data ){
            console.log( data );
        })
};