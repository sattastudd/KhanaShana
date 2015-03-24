define([], function() {
    function restaurantDetailsController($scope) {
    }
    return restaurantDetailsController;
});

function RestaurantDetailsController ($scope, $route, $http, $routeParams){
    console.log( $routeParams );

    $scope.rest = {};

    $http.get('node/public/restaurant/' + $routeParams.restSLug)
        .success( function( data ){
            console.log(data );

            $scope.rest.img = data.data.img.full;
        })
        .error( function ( data ) {
            console.log( data );
        })
};