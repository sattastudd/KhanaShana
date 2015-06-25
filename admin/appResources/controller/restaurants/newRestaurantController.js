define([], function ($scope) {
    function newRestaurantController() {
    };
    return newRestaurantController;
});

function NewRestaurantController($scope, $http, $rootScope, $timeout, DataStore, AppConstants, RestRequests) {

    /* Flag to detect if we are editing an already existing restaurant or creating a new.*/
    $scope.isEdit = false;

    $scope.selectedLocations = [];
    $scope.finalDeliveryAreas = [];
    $scope.deliveryAreas = [];

    $scope.selectedCuisines = [];
    $scope.finalSelectedCuisines = [];
    $scope.offeredCuisines= [];

    $scope.restaurant = {};

    $scope.err = {address : {}};
    $scope.errMsg = {};

    /* Flags to control error and success message visibility.*/
    $scope.isServerError = false;

    $scope.isServerSuccess = false;
    $scope.successMessage = '';

    $scope.errorMessage = '';

    /* Restaurant creation is divided into five stages. 
     * We will be using these stages to control the action to be taken on click on tabs.*/
    $scope.restaurantStages = [ 'basicDetails', 'deliveryAreas', 'cuisineArea', 'restMenu', 'imgUpload'];

    /* We will be firing a options request to retirive locations and cuisines. */
    var optionsRequest = AppConstants.adminServicePrefix + '/' + RestRequests.options;

    /* Init method to check if we are editing an already existing restaurant. 
     * If yes, we need to retrieve its full details using its slug field.
     * Since, slug field can itself be edited now, we would need to maintain a backup copy of it for now.
     * Which would be stored in $scope.restaurantOldSlug.*/
    $scope.init = function () {

        /* This flag would be set by another page. 
         * To avoid any re read issue, we will be deleting such flags and values as well.
         * If this flag is true, it would means we are editing.
         * If it isn't, we would have set some defaults like new restaurant's stage and its current stageIndex.*/
        if( DataStore.readAndRemove( 'isRestaurantEdit' )) {

            $scope.isEdit = true;

            $scope.restaurant.slug = DataStore.readAndRemove( 'toEditRestaurant');

            /* If we have a proper slug value stored in DataStore.*/
            if( angular.isDefined( $scope.restaurant.slug )) {

                var requestName = AppConstants.adminServicePrefix + '/' + RestRequests.restaurant + '/' + $scope.restaurant.slug;

                $http.get(requestName)
                    .success(function (data) {
                        $scope.restaurant = data.data;

                        $scope.restaurantOldSlug = $scope.restaurant.slug;

                        $scope.restaurant.street = $scope.restaurant.address.street;
                        $scope.restaurant.locality = $scope.restaurant.address.locality;
                        $scope.restaurant.town = $scope.restaurant.address.town;

                        $scope.restaurant.city = $scope.restaurant.address.city;
                        $scope.restaurant.postal_code = $scope.restaurant.address.postal_code;

                        $scope.restaurantStageIndex = $scope.restaurantStages.indexOf($scope.restaurant.stage);

                        if ($scope.restaurantStageIndex !== ($scope.restaurantStages.length - 1)) {
                            $scope.restaurant.stage = $scope.restaurantStages[ ++$scope.restaurantStageIndex ];
                        }

                        $rootScope.$broadcast('moveToPetooTab', $scope.restaurantStageIndex);

                        $scope.restaurantOldSlug = data.data.slug;

                        if ($scope.restaurant.delivery.length > 0) {
                            $scope.adjustLocations($scope.restaurant.delivery);
                        }

                        if ($scope.restaurant.cuisines.length > 0) {
                            $scope.adjustCuisines($scope.restaurant.cuisines);
                        }

                        if( typeof data.data.menu !== 'undefined' ) {
                            $scope.restMenu = data.data.menu;
                        }

                        if( typeof data.data.img !== 'undefined' ) {
                            $scope.paths = data.data.img;
                        }
                    })
                    .error(function (data) {
                        $scope.isServerError = true;
                        $scope.isServerSuccess = false;

                        $scope.errorMessage = data.msg;
                    })
            }
        } else {
            $scope.restaurant.stage = 'basicDetails';
            $scope.restaurantStageIndex = $scope.restaurantStages.indexOf( $scope.restaurant.stage );
        }

        /* Since, once we have retrived cuisines and locations from database, we also store it in DataStore for reuse.*/
        /* If the key representing cuisines storage is not there, we will fire request to fetch the same. */
        if( !DataStore.isKeyDefined( 'cuisines')) {

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
        } else {
            $scope.deliveryAreas = DataStore.getData( 'locations' );
            $scope.offeredCuisines = DataStore.getData( 'cuisines' );
        }
    };

    /*                       Controls of delivery Area Stage                       */
    /*=============================================================================*/
    /* Left Panes */

    /* This method is used to return a class for the left pane of delivery areas.
     * We maintain a seprate list of selectedLocations,
     * if the passed location is present in the list,
     * we would return 'active'
     */
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

    /* By Toggle Selection, we mean that if a location is present in selectedLocations,
     * On toggle, it would be removed or added depending upon its current state.*/
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

    /* With this, we will move selectedlocations into finalDeliveryAreas,
     * We will push locations into finalDeliveryAreas, so, we also need to remove selectedLocations from inital list as well.
     * And flush down selectedLocations as well. */
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

    /* With this we will remove a final selected location and add it to initial location list.*/
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

    /*                       Controls of cuisine Area Stage                       */
    /*=============================================================================*/
    /* This method is used to return a class for the left pane of cuisine areas.
     * We maintain a seprate list of slectedCuisines,
     * if the passed cuisine is present in the list,
     * we would return 'active'
     */
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

    /* By Toggle Selection, we mean that if a cuisine is present in selectedcuisines,
     * On toggle, it would be removed or added depending upon its current state.*/
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

    /* With this, we will move selectedCuisines into finalSelectedCuisines,
     * We will push cuisines into finalSelectedCuisines, so, we also need to remove selectedCuisines from inital list as well.
     * And flush down selectedCuisines as well. */
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

    /* With this we will remove a final selected location and add it to initial location list.*/
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

    /*                       Controls of Restaurant Price Stage                       */
    /*=============================================================================*/

    /* Restaurant Menu */
    $scope.restMenu = $scope.restaurant.menu = [];

    /* Method to add a new category to menu. */
    $scope.addNewCategory = function () {
        var newMenu = {
            title : '',
            items : []
        };

        var dish = {
            title : '',
            type : '',
            veg : false,
            price : {
                half : '',
                full : ''
            }
        };

        newMenu.items.push( dish );

        $scope.restMenu.push( newMenu );
    };

    /* Method to add item into category. */
    $scope.addNewItemInCategory = function( menu ){
        var dish = {
            title : '',
            type : '',
            veg : false,
            price : {
                half : '',
                full : ''
            }
        };

        menu.items.push( dish );
    };

    $scope.removeItemFromCategory = function( menus, index ) {
        menus.splice( index, 1 );
    };

    /*                       Controls of Image Upload Stage                       */
    /*=============================================================================*/

    $scope.files = {};
    $scope.paths = {};

    $scope.$on('selectedFile', function ($event, args) {
        $scope.$apply($scope.files[args.type] = args.file);
    });

    $scope.isFileNotSelected = function (type) {
        if( typeof $scope.paths[ type ] === 'undefined' ) {
            return typeof $scope.files[ type ] === 'undefined' ? '' : 'noHeight';
        } else {
            return 'noHeight';
        }
    };

    $scope.isFileSelected = function (type) {
        if ( typeof $scope.paths[ type ] === 'undefined' ) {
            return typeof $scope.files[ type ] !== 'undefined' ? '' : 'noHeight';
        } else {
            return '';
        }
    };

    $scope.getFileName = function (type) {
        if( typeof $scope.paths[ type ] === 'undefined' ) {
            return typeof $scope.files[ type ] !== 'undefined' ? $scope.files[ type ].name : '';
        } else {
            return $scope.paths[type ].substr( $scope.paths[type ].lastIndexOf('/'));
        }
    };

    $scope.removeFile = function (type) {
        delete $scope.paths[type];
        delete $scope.files[type];
    };

    /* This method would be used to create restaurants and would be accessible on basic details tab.
     * On others, it would be like updating details of existing restaurant.
     */
    $scope.createRestaurant = function () {

        var requestName = AppConstants.adminServicePrefix + '/' + RestRequests.restaurants;

        /* If we are editing restaurant, we should use saveAndContinue instead,
         * as createNewRestaurant doesn't handles multipart request.*/
        if( $scope.isEdit ) {
            $scope.saveAndContinue();
        } else {
            $http.post(requestName, $scope.restaurant)
                .success(function (data, status, headers, config) {
                    $scope.isServerError = false;
                    $scope.isServerSuccess = true;

                    $scope.successMessage = data.msg;

                    $scope.restaurant.stage  = data.data.stage;

                    $scope.err = data.err;
                    $scope.errMsg = data.errMsg;

                    $scope.restaurantOldSlug = $scope.restaurant.slug;

                    $scope.restaurant.delivery = [];
                    $scope.restaurant.cuisines = [];

                    /* Now we, are on same page. */
                    $timeout( function() {
                        $scope.isEdit = true;
                    }, 500 );

                    /* Time to move on to next stage as well. */
                    $scope.restaurantStageIndex = $scope.restaurantStages.indexOf( $scope.restaurant.stage );

                    if( $scope.restaurantStageIndex !== ($scope.restaurantStages.length -1 )) {
                        $scope.restaurant.stage = $scope.restaurantStages[ ++$scope.restaurantStageIndex ];
                    }
                })
                .error(function (data, status, headers, config) {
                    $scope.isServerError = true;
                    $scope.isServerSuccess = false;

                    $scope.errorMessage = data.msg;

                    $scope.err = data.err;
                    $scope.errMsg = data.errMsg;
                });
        }
    };

    /* SaveAndContinue would help in saving restaurant in stages. */
    $scope.saveAndContinue = function () {

        var requestName = AppConstants.adminServicePrefix + '/' + RestRequests.restaurant + '/' + $scope.restaurantOldSlug;

        if ($scope.restaurant.stage === 'deliveryAreas') {
            $scope.restaurant.locations = [];

            for (var i = 0; i < $scope.finalDeliveryAreas.length; i++) {
                var locationAt = $scope.finalDeliveryAreas[i];

                $scope.restaurant.locations.push(locationAt.name);
            }
        } else if ($scope.restaurant.stage === 'cuisineArea') {
            $scope.restaurant.cuisines = [];

            for (var i = 0; i < $scope.finalSelectedCuisines.length; i++) {
                var cuisineAt = $scope.finalSelectedCuisines[i];

                $scope.restaurant.cuisines.push(cuisineAt.name);
            }
        } else if ($scope.restaurant.stage === 'restMenu') {
            var restMenuLength = $scope.restMenu.length;

            for (var i = 0; i < restMenuLength; i++) {
                var category = $scope.restMenu[i];

                delete category.err;
                delete category.errMsg;

                var items = category.items;

                for (var j = 0; j < items.length; j++) {
                    var item = items[j];

                    delete item.err;
                    delete item.errMsg;
                }

            }

            $scope.restaurant.menu = $scope.restMenu;
        } else if( $scope.restaurant.stage === 'imgUpload' ) {
            var filesTypeArray = ['xs', 'sm', 'md', 'lg'];

            for( var i=0; i<filesTypeArray.length; i++) {
                var type = filesTypeArray[ i ];
                if( typeof $scope.paths[ type ] !== 'undefined' ) {
                    delete $scope.files[ type ];
                }
            }
        }

        $http({
            method: 'PUT',
            url: requestName,
            headers: { 'Content-Type': undefined },
            transformRequest: function (data) {
                var formData = new FormData();
                formData.append("model", angular.toJson(data.model));

                if ($scope.restaurant.stage === 'imgUpload') {
                    var arr = ['lg', 'md', 'sm', 'xs'];

                    for (var i = 0; i < arr.length ; i++) {
                        if (typeof $scope.files[ arr[i]] !== 'undefined') {
                            formData.append( arr[i], $scope.files[ arr[i] ]);
                        }
                    }
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

                /* A little bit of stage handling. */
                $scope.restaurantStageIndex = $scope.restaurantStages.indexOf( $scope.restaurant.stage );

                if( $scope.restaurantStageIndex !== ($scope.restaurantStages.length -1 )) {
                    $scope.restaurant.stage = $scope.restaurantStages[ ++$scope.restaurantStageIndex ];
                }

                /* With this, we would be able to move to next tab automatically. */
                $rootScope.$broadcast('moveToPetooTab', $scope.restaurantStageIndex);
            }).
            error(function (data, status, headers, config) {
                $scope.isServerError = true;
                $scope.isServerSuccess = false;

                $scope.errorMessage = data.msg;

                if ($scope.restaurant.stage === 'restMenu') {
                    if( data.data != null ) {
                        $scope.restaurant.menu = data.data;
                        $scope.restMenu = data.data;
                    }
                } else {
                    $scope.err = data.err;
                    $scope.errMsg = data.errMsg;
                }
            });
    };


    /* Error Getter */
    /* Validation Getters */
    $scope.hasFieldError = function ( type, isFieldValue ) {

        if( isFieldValue ) {

            return type ? '' : 'noHeight';

        } else {
            if (type.split('.').length === 1)
                return $scope.err[ type ] ? '' : 'noHeight';
            else {
                var splitArray = type.split('.');

                var firstPart = splitArray[ 0 ];
                var secondPart = splitArray[ 1 ];

                var temp = $scope.err[ firstPart ];
                return temp[secondPart] ? '' : 'noHeight';
            }
        }
    };


    $scope.haveReceivedErrorFromServer = function() {
        return $scope.isServerError ? '' : 'noHeight';
    };

    $scope.haveReceivedSuccessFromServer = function(){
        return $scope.isServerSuccess ? '' : 'noHeight';
    };

    /* Method to determine if a current tag is disabled.
     * We identify it using stages' index in the location.
     * All tabs having index lower than current stage index would be enabled.
     * Others, would be disabled.
     */
    $scope.isTabDisabled = function( name ) {

        var tabNameIndex = $scope.restaurantStages.indexOf( name );

        if( $scope.restaurantStageIndex < tabNameIndex ) {
            return true;
        } else {
            return false;
        }
    };

    /* On tab click, we want stage to be automatically updated.
     * But we still have to move to next tab on success.
     */
    $scope.setRestaurantStage = function (stage) {

        $scope.restaurant.stage = stage;

        if (stage === 'deliveryAreas') {
            if ($scope.restaurant.delivery.length > 0) {
                $scope.adjustLocations($scope.restaurant.delivery);
            }
        } else if (stage === 'cuisineArea') {
            if ($scope.restaurant.cuisines.length > 0) {
                $scope.adjustCuisines($scope.restaurant.cuisines);
            }
        }
    };

    $scope.getMessageForBasicDetailsButton = function () {
        return $scope.isEdit ? 'Update Restaurant Info' : 'Create New Restaurant' ;
    };

    /* Since, the way we send locations to db, is different than we handle here.
     * From DB, we receive locations as { name : locationName },
     * but for restaurant details, we send it as [ locationName ],
     * a little bit of working is necessary to adjust this.     * 
     */
    $scope.adjustLocations = function (restaurantLocationsFromDB) {
        var receivedLocationsLength = restaurantLocationsFromDB.length;

        console.log(DataStore.getData('locations'));

        for (var i = 0; i < receivedLocationsLength; i++) {
            var locationFromDB = restaurantLocationsFromDB[i];

            var deliveryAreasLength = $scope.deliveryAreas.length;

            for (var j=0; j < deliveryAreasLength; j++) {
                var locationAt = $scope.deliveryAreas[j];

                if (locationAt.name === locationFromDB) {
                    $scope.finalDeliveryAreas.push(locationAt);
                    $scope.deliveryAreas.splice(j, 1);

                    break;
                }
            }
        }
    };

    /* Since, the way we send cuisines to db, is different than we handle here.
     * From DB, we receive locations as { name : cuisineName },
     * but for restaurant details, we send it as [ cuisineName ],
     * a little bit of working is necessary to adjust this.     * 
     */
    $scope.adjustCuisines = function (restaurantCuisinesFromDB) {
        var receivedCuisinesLength = restaurantCuisinesFromDB.length;

        for (var i = 0; i < receivedCuisinesLength; i++) {
            var cuisineFromDB = restaurantCuisinesFromDB[i];

            var cuisinesLength = $scope.offeredCuisines.length;

            for (var j = 0; j < cuisinesLength; j++) {
                var cuisineAt = $scope.offeredCuisines[ j ];

                if (cuisineAt.name === cuisineFromDB) {
                    $scope.finalSelectedCuisines.push(cuisineAt);
                    $scope.offeredCuisines.splice(j, 1);

                    break;
                }
            }
        }
    };

    /*Function to opwn banner image in next tab */
    $scope.openImage = function( type ) {
        console.log(type);

        if( $scope.paths[ type ] !== 'undefined' ) {

            var path = 'node/public/restaurants/image?slug=' + $scope.restaurant.slug + '&type=' + type;

            window.open( path );
        }
    };
};