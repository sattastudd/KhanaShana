define([], function ($scope) {
    function newRestaurantController() {
    };
    return newRestaurantController;
});

function NewRestaurantController($scope, $http, DataStore, AppConstants, RestRequests) {
    $scope.collapseController = {
        basicInfo: false,
        address: true,
        co_ord: true
    };

    $scope.selectedLocations = [];
    $scope.finalDeliveryAreas = [];
    $scope.deliveryAreas = [];

    $scope.selectedCuisines = [];
    $scope.finalSelectedCuisines = [];
    $scope.offeredCuisines= [];

    $scope.isExpanded = function (type) {
        return $scope.collapseController[type] ? 'makeRightAngle' : '';
    };

    $scope.toggleExpand = function (type) {
        $scope.collapseController[type] = !$scope.collapseController[type];
    };

    var optionsRequest = AppConstants.adminServicePrefix + '/' + RestRequests.options;

    /* Left Panes */
    
    $scope.isLocationSelected = function (location) {
        var locationLength = $scope.selectedLocations.length;

        for (var i = 0; i < locationLength; i++) {
            var loc = $scope.selectedLocations[i];

            if (loc === location) {
                return 'active';
            }
        }

        return '';
    };

    $scope.toggleLocationSelection = function( location ){
        var locationsLength = $scope.selectedLocations.length;

        for( var i = 0; i < locationsLength; i++ ){
            var loc = $scope.selectedLocations[i];

            if( loc === location ){
                $scope.selectedLocations.splice(i, 1);
                return;
            }
        }

        $scope.selectedLocations.push( location );
    };

    $scope.makeSelectionFinal = function () {
        var locationsLength = $scope.selectedLocations.length;

        for( var i=0; i < locationsLength ; i++) {
            var selectedLocation = $scope.selectedLocations[i];
            $scope.finalDeliveryAreas.push( selectedLocation );

            var deliveryAreasLength = $scope.deliveryAreas.length;

            for( var j=0; j<deliveryAreasLength; j++){
                var location = $scope.deliveryAreas[ j] ;

                if( location === selectedLocation ){
                    $scope.deliveryAreas.splice(j, 1 );
                    break;
                }
            }
        };

        $scope.selectedLocations = [];
    };

    $scope.removeLocationFromSelection = function( location ) {
        var locationsLength = $scope.finalDeliveryAreas.length;

        for( var i=0; i<locationsLength; i++){
            var loc = $scope.finalDeliveryAreas[i];

            if( loc === location ){
                $scope.finalDeliveryAreas.splice(i, 1 );
                break;
            }
        }

        $scope.deliveryAreas.push( location );
    };

    /*Cuisine Controls*/
    $scope.isCuisineSelected = function( cuisine ){
        var selectedCuisinesLength = $scope.selectedCuisines.length;

        for( var i=0; i< selectedCuisinesLength; i++){
            var cuisineAt = $scope.selectedCuisines[ i ];

            if( cuisineAt === cuisine ){
                return 'active';
            }
        }
        return '';
    };

    $scope.toggleSelectionForCuisine = function( cuisine ){
        var selectedCuisinesLength = $scope.selectedCuisines.length;

        for( var i=0; i< selectedCuisinesLength; i++){
            var cuisineAt = $scope.selectedCuisines[ i ];

            if( cuisineAt === cuisine ){
                $scope.selectedCuisines.splice(i, 1 );
                return ;
            }
        }

        $scope.selectedCuisines.push( cuisine );
    };

    $scope.makeCuisineSelectionFinal = function  (){
 
        var selectedCuisinesLength = $scope.selectedCuisines.length;

        for( var i=0;i< selectedCuisinesLength; i++){
            var selectedCuisine = $scope.selectedCuisines[i];

            $scope.finalSelectedCuisines.push( selectedCuisine );

            var offeredCuisinesLength = $scope.offeredCuisines.length;

            for( var j=0; j< offeredCuisinesLength; j++){
                var cuisineAt = $scope.offeredCuisines[ j ];

                if( cuisineAt === selectedCuisine ){
                    $scope.offeredCuisines.splice(j, 1);
                    break;
                }
            }
        }

        $scope.selectedCuisines = [];
    };

    $scope.removeCuisineFromSelection = function( cuisine ) {

        var selectedCuisinesLength = $scope.finalSelectedCuisines.length;

        for( var i=0;i<selectedCuisinesLength; i++){
            var cuisineAt = $scope.finalSelectedCuisines[i];

            if( cuisineAt === cuisine ){
                $scope.finalSelectedCuisines.splice(i, 1);
                break;
            }
        }

        $scope.offeredCuisines.push( cuisine );
    };

    $http.get(optionsRequest)
        .success(function (data) {
            DataStore.storeData('cuisines', data.data.cuisines);
            DataStore.storeData('locations', data.data.locations);

            $scope.deliveryAreas = data.data.locations;
            $scope.offeredCuisines = data.data.cuisines;

        })
        .error(function (data) {
            console.log(data);
        });


    /* Restaurant Menu */
    $scope.restMenu = [];

    $scope.addNewCategory = function () {
        var newMenu = {
            title : '',
            items : []
        };

        $scope.restMenu.push( newMenu );
    };

    $scope.addNewItemInCategory = function( menu ){
        var dish = {
            title : '',
            type : '',
            veg : '',
            price : {
                half : '',
                full : ''
            }
        };

        menu.items.push( dish );
    };
};
