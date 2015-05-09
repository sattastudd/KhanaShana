define([], function() {
    function restaurantDetailsController($scope) {
    }
    return restaurantDetailsController;
});

function RestaurantDetailsController ($scope, $route, $http, $routeParams){
    console.log( $routeParams );

    $scope.rest = {};

    $scope.dishShortlisted = [];

    console.log('alpha to charlie');

    $http.get('node/public/restaurant/' + $routeParams.restSLug)
        .success( function( data ){
            console.log(data );

            $scope.rest.name = data.data.name;
            //$scope.rest.img = data.data.img.full;
            $scope.rest.menus = data.data.menu;

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
        console.log(menu.items);
        //if (menu.items.price) {};
    }

    $scope.count = 1;

    $scope.itemAddedHalf = function(item){
        console.log(item.title);
        console.log(item.price.half);

        var objectToPush = {
            dish : item.title,
            price : item.price.half,
            quantity : 1
        }
        
        $scope.dishShortlisted.push( objectToPush );

        
    }
    $scope.itemAddedFull = function(item){
        console.log(item);

        var objectToPush = {
            dish : item.title,
            price : item.price.full,
            quantity : 1
        }
        
        $scope.dishShortlisted.push( objectToPush );
    }

    /*$scope.quantity = 1;
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
*/
};