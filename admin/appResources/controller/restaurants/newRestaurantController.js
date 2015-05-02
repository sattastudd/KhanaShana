define([], function ($scope) {
    function newRestaurantController() {
    };
    return newRestaurantController;
});

function NewRestaurantController($scope, $http, $modal, DataStore, AppConstants, RestRequests) {
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

    $scope.files = [];

    $scope.$on("selectedFile", function (event, args) {
        $scope.$apply(function () {
            console.log('File Selected');
            //add the file object to the scope's files collection
            $scope.files = [];
            $scope.files.push(args.file);
            console.log( $scope.files );
        });

        var modalInstance = $modal.open({
            templateUrl : '../../views/restaurants/BannerCropModal.html',
            controller : ImageCropController,
            size : 'lg',
            backdrop : 'static',
            resolve : {
                fileToRead : function(){
                    return $scope.files[0];
                }
            }
        });

        modalInstance.result.then(
            function( data ){
                console.log( data );

                $scope.imageData = data;
            },

            function( data ){
                console.log( data );
            }
        )
    });

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
};

function ImageCropController( $scope, $modalInstance, fileToRead ){
    $scope.fileToRead = fileToRead;

    $scope.getCroppedInfoFromDirective = function(){
        console.log('BroadCasting Event' );
        $scope.$broadcast('emitCroppedInfo');
        //$modalInstance.close();
    };

    $scope.$on('emittedCoOrdinates', function( $event, args ){
        $modalInstance.close( args );
    });
};
