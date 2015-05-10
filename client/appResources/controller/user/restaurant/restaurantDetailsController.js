define([], function() {
    function restaurantDetailsController($scope) {
    }
    return restaurantDetailsController;
});

function RestaurantDetailsController ($scope, $route, $http, $routeParams){
    console.log( $routeParams );

    $scope.rest = {};

    console.log('alpha to charlie');

    $http.get('node/public/restaurant/' + $routeParams.restSLug)
        .success( function( data ){
            console.log(data );

            $scope.rest.name = data.data.name;
            //$scope.rest.img = data.data.img.full;
            $scope.rest.menus = data.data.menu;
            $scope.rest.img = data.data.img;
        })
        .error( function ( data ) {
            console.log( data );
        });

    console.log("i want this one");
    console.log($scope.rest.menus);

    $scope.menuSelected = function (menu) {
        console.log(menu);
        $scope.menu = menu;
        $scope.menuName = menu.title;
    }

    $scope.itemAdded = function(item){
        console.log("item clicked");
        item.itemClicked = true;
        if($scope.hideAddItem === true){
            item.itemClicked = false;
            $scope.quantity = 1;
        }
        $scope.hideAddItem = false;
    }

    $scope.quantity = 1;
    $scope.quantityIncreased = function(){
        console.log('quantity increased');
        $scope.quantity = $scope.quantity + 1;
    }
    $scope.quantityDecreased = function(item){
        $scope.quantity = $scope.quantity - 1;
        if($scope.quantity === null || $scope.quantity === 0){
            $scope.hideAddItem = true;
        }
    }

};