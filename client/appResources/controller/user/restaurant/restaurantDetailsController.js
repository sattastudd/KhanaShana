define([], function() {
    function restaurantDetailsController($scope) {
    }
    return restaurantDetailsController;
});

function RestaurantDetailsController ($scope, $route, $routeParams){
    console.log( $routeParams );
};