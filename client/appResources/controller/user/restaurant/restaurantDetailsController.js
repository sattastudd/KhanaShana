define([], function() {
    function restaurantDetailsController($scope) {
    }
    return restaurantDetailsController;
});

function RestaurantDetailsController ($scope, $modal, $routeParams, $location, DataStore, $window, $http, AppConstants, RestRequests){
    console.log( $routeParams );

    $scope.rest = {};

    $scope.dishShortlisted = [];

    console.log('alpha to charlie');

    $http.get('node/public/restaurant/' + $routeParams.restSLug)
        .success( function( data ){
            console.log(data );

            $scope.rest.name = data.data.name;
            $scope.rest.img = data.data.img;
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

    
   /* $scope.openQuickView = function(index){
        var current = $scope.result[index];
        var status = current.showQuickView;
    
        for(var i=0; i<$scope.result.length; i++){
            
            var obj = $scope.result[i];
            obj.showQuickView = true;
        }
        
        current.showQuickView = !status;
    }*/
    
    

    //$scope.count = 1;

    $scope.itemAddedHalf = function(item,index){
        console.log(item.title);
        console.log(item.price.half);
        $scope.cartLoaded = true;
        $scope.itemAddedName = item.title;


        var objectToPush = {
            dish : item.title,
            price : item.price.half,
            quantity : 1,
            totalPrice : item.price.half,
            value : "Half"
        }
        
        $scope.dishShortlisted.push( objectToPush );

        DataStore.storeData( 'dishShortlisted', $scope.dishShortlisted );

        console.log($scope.dishShortlisted[0].dish);
    }

    $scope.itemAddedFull = function(item){
        $scope.cartLoaded = true;
        //console.log($scope.dishShortlisted.quantity);
        $scope.itemAddedName = item.title;
        console.log("the value is>>>>>"+$scope.itemAddedName);

            var objectToPush = {
                dish : item.title,
                price : item.price.full,
                quantity : 1,
                totalPrice : item.price.full,
                value : "Full"
            }
            
            $scope.dishShortlisted.push( objectToPush );
             DataStore.storeData( 'dishShortlisted', $scope.dishShortlisted );
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
    $scope.removeDish = function(index){
        
        $scope.dishShortlisted.splice(index, 1);
        console.log($scope.dishShortlisted);
    }

    $scope.proceeded = function(){
        $location.path('/CheckOut');
    }


    $scope.reviewOrder = function(){
         $modal.open({
                templateUrl : 'views/modals/orderReview/orderReviewModal.html',
                controller : 'orderReviewModalController',
                windowClass    : 'darkTransparentBack',
                resolve : {
                    displayedOnPage : function() {
                       // return $scope.locations;
                    }
                }
            })
    }

};


function orderReviewModalController ($scope, $modalInstance, $location, DataStore, AppConstants, RestRequests, $http, displayedOnPage ) {

    $scope.closeModal = function(){
        $modalInstance.close();
    }

    $scope.dishShortlisted =  DataStore.getData( 'dishShortlisted' );

    $scope.quantityIncreased = function(dish){
        console.log(dish);

        dish.quantity = dish.quantity + 1;
        dish.totalPrice = dish.quantity * dish.price;

    }
    $scope.quantityDecreased = function(dish){

        dish.quantity = dish.quantity - 1;
        dish.totalPrice = dish.quantity * dish.price;
    }
    $scope.removeDish = function(index){
        
        $scope.dishShortlisted.splice(index, 1);
        console.log($scope.dishShortlisted);
    }

    $scope.proceeded = function(){
        $location.path('/CheckOut');
    }
}    
