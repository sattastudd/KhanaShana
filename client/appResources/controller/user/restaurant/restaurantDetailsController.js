define([], function() {
    function restaurantDetailsController($scope) {
    }
    return restaurantDetailsController;
});

function RestaurantDetailsController ($scope, $modal, $routeParams, $location, AppConstants, RestRequests, DataStore, $http, UserInfoProvider, $rootScope ) {
    $scope.rest = {};

   // $scope.ratingStars = 3;

    $scope.dishShortlisted = [];

    $scope.closeOtherMenus = function() {
        angular.forEach( $scope.rest.menus, function( menu ) {
            menu.isCollapsed = true;
        });
    };

    var restaurantDataRequestName = AppConstants.httpServicePrefix + '/' + RestRequests.restaurant + '/';

    $http.get(restaurantDataRequestName + $routeParams.restSLug)
        .success( function( data ){
            $scope.rest.slug = data.data.slug;
            $scope.rest.name = data.data.name;
            $scope.rest.img = data.data.img;
            $scope.rest.menus = data.data.menu;
            $scope.rest.detail = data.data.detail;
            $scope.rest.cuisines = data.data.cuisines;

            $scope.closeOtherMenus();

            DataStore.storeData('restName', $scope.rest.name);
            DataStore.storeData('restSLug', $scope.rest.slug);

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

    $scope.itemAddedHalf = function(item, categoryTitle){

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
                value: "Half",
                category : categoryTitle
            };

            $scope.dishShortlisted.push(objectToPush);
        }
        DataStore.storeData( 'dishShortlisted', $scope.dishShortlisted );
    };

    $scope.itemAddedFull = function(item, categoryTitle){

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
                value: "Full",
                category : categoryTitle
            };

            $scope.dishShortlisted.push(objectToPush);
        }
        DataStore.storeData( 'dishShortlisted', $scope.dishShortlisted );
    };

    $scope.quantityIncreased = function(dish){
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
    };

    $scope.proceeded = function(){

        if( !UserInfoProvider.isUserLoggedIn() ) {
        $rootScope.openLoginModal();
        } else {
            var payLoad = {
                restaurant : {
                    name : $scope.rest.name,
                    slug : $scope.rest.slug
                },
                dishes : $scope.dishShortlisted
            };

            var requestName = AppConstants.loggedInUser + '/' + RestRequests.pendingOrder;

            $http.post(requestName, payLoad)
                .success( function( data ) {
                    console.log( data );
                })
                .error( function( data ) {
                    console.log( data );
                });


            DataStore.storeData('dishShortlisted', $scope.dishShortlisted);
            $location.path('/checkOut');
        }
    };

    $scope.getTotalCost = function() {

        var cost = 0;

        if( $scope.dishShortlisted.length > 0 ) {
            angular.forEach( $scope.dishShortlisted, function( item ) {
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


function orderReviewModalController ($scope, UserInfoProvider, $modalInstance, $location, DataStore, AppConstants, RestRequests, $http, displayedOnPage, $rootScope ) {

    $scope.closeModal = function(){
        $modalInstance.close();
    };

    $scope.dishShortlisted =  DataStore.getData( 'dishShortlisted' );

    $scope.quantityIncreased = function(dish){
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
    };

    $scope.proceeded = function(){

        if( !UserInfoProvider.isUserLoggedIn() ) {
        $rootScope.openLoginModal();
        } else {
            var payLoad = {
                restaurant : {
                    name : DataStore.getData('restName'),
                    slug : DataStore.getData('restSLug')
                },
                dishes : $scope.dishShortlisted
            };

            var requestName = AppConstants.loggedInUser + '/' + RestRequests.pendingOrder;

            $http.post(requestName, payLoad)
                .success( function( data ) {
                    console.log( data );
                })
                .error( function( data ) {
                    console.log( data );
                });


            DataStore.storeData('dishShortlisted', $scope.dishShortlisted);
            $scope.closeModal();
            $location.path('/checkOut');
            window.scrollTo(0, 0);
        }
    };
    $scope.removeDish = function(index){
        
        $scope.dishShortlisted.splice(index, 1);
    };

     $scope.getTotalCost = function() {

        var cost = 0;

        if( $scope.dishShortlisted.length > 0 ) {
            angular.forEach( $scope.dishShortlisted, function( item ) {
                cost = cost + item.totalPrice;
            })
        }

        return cost;

    };
}    
