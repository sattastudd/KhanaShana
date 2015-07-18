define([], function() {
    function restaurantDetailsController($scope) {
    }
    return restaurantDetailsController;
});

function RestaurantDetailsController ($scope, $modal, $routeParams, $location, DataStore, $http, UserInfoProvider, $rootScope ) {
    console.log( $routeParams );

    $scope.rest = {};

   // $scope.ratingStars = 3;

    $scope.dishShortlisted = [];

    $scope.closeOtherMenus = function() {
        angular.forEach( $scope.rest.menus, function( menu ) {
            menu.isCollapsed = true;
        });
    };

    $http.get('node/public/restaurant/' + $routeParams.restSLug)
        .success( function( data ){
            console.log(data );

            $scope.rest.name = data.data.name;
            $scope.rest.img = data.data.img;
            $scope.rest.menus = data.data.menu;
            $scope.rest.detail = data.data.detail;
            $scope.rest.cuisines = data.data.cuisines;

            $scope.closeOtherMenus();

        })
        .error( function ( data ) {
            console.log( data );
        });

    $scope.menuSelected = function (menu) {
        var collapsedStateOfPassedMenu = menu.isCollapsed;
        $scope.closeOtherMenus();

        $scope.menu = menu;
        $scope.menuName = menu.title;

        menu.isCollapsed = !collapsedStateOfPassedMenu;
    };

    $scope.showShowMenu = function(){
        return typeof $scope.menu !== 'undefined' ? '' : 'inVisible';
    };

    $scope.showCheckoutLink = function() {
        return typeof $scope.dishShortlisted.length !== 'undefined' && $scope.dishShortlisted.length > 0 ? '' : 'inVisible';
    };

    $scope.isSelectedDishAlreadyPresentInTheOrder = function( dish, type ) {
        var index = -1;

        var shortListedDishLength = $scope.dishShortlisted.length;

        for( var i=0; i<shortListedDishLength; i++ ) {
            var dishAtIndex = $scope.dishShortlisted[i];

            if( dishAtIndex.dish === dish.title && type === dishAtIndex.value ) {
                index = i;
                break;
            }
        }

        return index;
    };

    $scope.itemAddedHalf = function(item,index){

        var indexOfElementIfAlreadyPresent =  $scope.isSelectedDishAlreadyPresentInTheOrder( item, 'Half');

        if( indexOfElementIfAlreadyPresent !== -1 ) {
            $scope.dishShortlisted[ indexOfElementIfAlreadyPresent].quantity++;
            $scope.dishShortlisted[ indexOfElementIfAlreadyPresent].totalPrice = $scope.dishShortlisted[ indexOfElementIfAlreadyPresent].price * $scope.dishShortlisted[ indexOfElementIfAlreadyPresent].quantity;
        } else {

            $scope.cartLoaded = true;
            $scope.itemAddedName = item.title;


            var objectToPush = {
                dish: item.title,
                price: item.price.half,
                quantity: 1,
                totalPrice: item.price.half,
                value: "Half"
            };

            $scope.dishShortlisted.push(objectToPush);

            DataStore.storeData('dishShortlisted', $scope.dishShortlisted);
        }
    };

    $scope.itemAddedFull = function(item){

        var indexOfElementIfAlreadyPresent =  $scope.isSelectedDishAlreadyPresentInTheOrder( item, 'Full');

        if( indexOfElementIfAlreadyPresent !== -1 ) {
            $scope.dishShortlisted[ indexOfElementIfAlreadyPresent].quantity++;
            $scope.dishShortlisted[ indexOfElementIfAlreadyPresent].totalPrice = $scope.dishShortlisted[ indexOfElementIfAlreadyPresent].price * $scope.dishShortlisted[ indexOfElementIfAlreadyPresent].quantity;
        } else {

            $scope.cartLoaded = true;
            $scope.itemAddedName = item.title;


            var objectToPush = {
                dish: item.title,
                price: item.price.full,
                quantity: 1,
                totalPrice: item.price.full,
                value: "Full"
            };

            $scope.dishShortlisted.push(objectToPush);
            DataStore.storeData('dishShortlisted', $scope.dishShortlisted);
        }
    };

    $scope.quantityIncreased = function(dish){
        console.log(dish);

        dish.quantity = dish.quantity + 1;
        dish.totalPrice = dish.quantity * dish.price;

    };
    $scope.quantityDecreased = function(dish){

        if( dish.quantity > 2 ) {
            dish.quantity = dish.quantity - 1;
            dish.totalPrice = dish.quantity * dish.price;
        }
    };
    $scope.removeDish = function(index){
        
        $scope.dishShortlisted.splice(index, 1);
        console.log($scope.dishShortlisted);
    };

    $scope.proceeded = function(){

        if( !UserInfoProvider.isUserLoggedIn() ) {
        $rootScope.openLoginModal();
        } else {
            $location.path('/checkOut');
        }
    };

    $scope.getTotalCost = function() {

        var cost = 0;

        if( $scope.dishShortlisted.length > 0 ) {
            angular.forEach( $scope.dishShortlisted, function( item ) {
                console.log( item ) ;

                cost = cost + item.totalPrice;
            })
        }

        return cost;

    };


$scope.reviews = [{name:'Saumya',review:'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',rating:'2'},
                     {name:'Gaurav',review:'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',rating:'3'},
                     {name:'Mayank',review:'Lorem ipsum dolor sit amet,',rating:'3'},
                     {name:'Magan',review:'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',rating:'5'},
                     {name:'Ashish',review:'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',rating:'4'}];


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
