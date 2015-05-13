define([], function() {
    function restaurantDetailsController($scope) {
    }
    return restaurantDetailsController;
});

function RestaurantDetailsController ($scope, $route, $http, $routeParams, $location){
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

    //$scope.count = 1;

    $scope.itemAddedHalf = function(item){
        console.log(item.title);
        console.log(item.price.half);
        $scope.cartLoaded = true;

        if(typeof $scope.dishShortlisted.quantity === 'undefined'){
        var objectToPush = {
            dish : item.title,
            price : item.price.half,
            quantity : 1,
            totalPrice : item.price.half,
            value : "Half"
        }
        
        $scope.dishShortlisted.push( objectToPush );
    }else{
        console.log("its in else part");
    }

        
    }
    $scope.itemAddedFull = function(item){
        console.log(item);
        $scope.cartLoaded = true;
        //console.log($scope.dishShortlisted.quantity);

            var objectToPush = {
                dish : item.title,
                price : item.price.full,
                quantity : 1,
                totalPrice : item.price.full,
                value : "Full"
            }
            
            $scope.dishShortlisted.push( objectToPush );
            //$scope.dishDuplicacy = $scope.
    }

    $scope.quantityIncreased = function(dish){
        console.log(dish);

        dish.quantity = dish.quantity + 1;
        dish.totalPrice = dish.quantity * dish.price;
    }
    $scope.quantityDecreased = function(dish){

        dish.quantity = dish.quantity - 1;
        dish.totalPrice = dish.quantity * dish.price;
    }
    $scope.proceeded = function(){
        $location.path('/CheckOut');
    }
};