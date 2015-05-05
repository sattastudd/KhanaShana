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

    $scope.restaurant = {};

    $scope.err = {address : {}};
    $scope.errMsg = {};

    $scope.isServerError = false;

    $scope.isServerSuccess = false;
    $scope.successMessage = '';

    $scope.errorMessage = '';

    /* Init method */
    $scope.init = function () {
        if( DataStore.readAndRemove( 'isRestaurantEdit' )) {
            $scope.restaurant.slug = DataStore.readAndRemove( 'toEditRestaurant ');

            if( angular.isDefined( $scope.restaurant.slug )) {
                var requestName = AppConstants.adminServicePrefix + '/' + RestRequests.restaurant + '/' + $scope.restaurant.slug;

                $http.get(requestName)
                    .success(function (data) {
                        console.log(data);
                    })
                    .error(function (data) {
                        console.log(data);
                    })
            }
        }
    };

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

    $scope.files = [];

    $scope.try = function () {
        console.log( $scope.restMenu );
        $http({
            method: 'POST',
            url: "node/admin/restaurant",
            headers: { 'Content-Type': undefined },
            transformRequest: function (data) {
                var formData = new FormData();
                formData.append("model", angular.toJson(data.model));

                for (var i = 0; i < data.files.length; i++) {
                    formData.append("file" + i, data.files[i]);
                }

                return formData;
            },

            data: { model: $scope.imageData, files: $scope.files }
        }).
            success(function (data, status, headers, config) {
                alert("success!");
            }).
            error(function (data, status, headers, config) {
                alert("failed!");
            });
    };

    $scope.saveAndContinue = function () {
        $scope.restaurant.stage = 'basicDetails';

        var requestName = AppConstants.adminServicePrefix + '/' + RestRequests.restaurants;

        $http({
            method: 'POST',
            url: requestName,
            headers: { 'Content-Type': undefined },
            transformRequest: function (data) {
                var formData = new FormData();
                formData.append("model", angular.toJson(data.model));

                for (var i = 0; i < data.files.length; i++) {
                    formData.append("file" + i, data.files[i]);
                }

                return formData;
            },

            data: { model: $scope.restaurant, files: $scope.files }
        }).
            success(function (data, status, headers, config) {
                $scope.isServerError = false;
                $scope.isServerSuccess = true;

                $scope.successMessage = data.msg;

                $scope.err = data.err;
                $scope.errMsg = data.errMsg;
            }).
            error(function (data, status, headers, config) {
                $scope.isServerError = true;
                $scope.isServerSuccess = false;

                $scope.errorMessage = data.msg;

                $scope.err = data.err;
                $scope.errMsg = data.errMsg;

                if( $scope.restaurant.stage === 'basicDetails' ){
                    delete $scope.restaurant.stage;
                }
            });
    };


    /* Error Getter */
    /* Validation Getters */
    $scope.hasFieldError = function ( type ) {
        console.log( type );
        if( type.split('.').length === 1 )
            return $scope.err[ type ] ? '' : 'noHeight';
        else {
            var splitArray = type.split( '.' );

            var firstPart = splitArray[ 0 ];
            var secondPart = splitArray[ 1 ];

            var temp = $scope.err[ firstPart ];
            return temp[secondPart] ? '' : 'noHeight';
        }
    };

    $scope.isStageValid = function() {
        if( angular.isUndefined( $scope.restaurant.stage ) && $scope.restaurant.stage !== ''){
            return false;
        }

        return true;

    };

    $scope.haveReceivedErrorFromServer = function() {
        return $scope.isServerError ? '' : 'noHeight';
    };

    $scope.haveReceivedSuccessFromServer = function(){
        return $scope.isServerSuccess ? '' : 'noHeight';
    };
};
