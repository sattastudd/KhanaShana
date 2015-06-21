define( [], function() {

	function homeController($scope) {

	}
	return homeController;;
} );

function BannerController($scope, $modal, $location, DataStore, $window, $http, AppConstants, RestRequests) {

    /* We have to design fulfill following requirements.
     * If text is empty, and user clicks, then a dropdown of menu would be displayed.
     * And user can use it to constrain his search.
     * If user hasn't selected anything, then we will display all type-ahead menus.
     */
    $scope.bannerSearch = {
        searchText : ''
    };

    var requestNameForTypeAhead = AppConstants.httpServicePrefix + '/' + RestRequests.typeahead;

    $scope.backUpOfOpetions = [
        {menuTitle: "Search By Location", type: "loc"},
        { menuTitle: "Search All Restaurants", type: "rest" }
    ];

    $scope.bannerDropDownOptions = [
        {menuTitle: "Search By Location", type: "loc"},
        { menuTitle: "Search All Restaurants", type: "rest" }
    ];

    $scope.shouldDropDownBeShown = false;

    /* $scope.$watch for watching over searchText of bannerSearch */
    $scope.$watch( function(){
        return $scope.bannerSearch.searchText;
    }, function( currentValue, prevValue ){

        if( currentValue.length > 0 ){
        $http.post( requestNameForTypeAhead, { text : currentValue })
            .success( function( data ) {
                console.log( data );

                var searchResult = data.data;
                var typeAheadOptions = [];
                var restaurantInResult = searchResult.restaurants;

                if( restaurantInResult.length > 0 ) {
                    typeAheadOptions.push( {
                        menuTitle : 'Restaurants', type : 'rest', isHeading : true
                    });

                    for( var i = 0 ; i< restaurantInResult.length; i++ ) {
                        var rest = restaurantInResult [ i ] ;
                        typeAheadOptions.push({
                            menuTitle : rest.name, type : 'rest', slug : rest.slug
                        });
                    }
                }

                var dishesInResult = searchResult.menu;

                if( dishesInResult.length > 0 ) {
                    typeAheadOptions.push({
                        menuTitle : 'Dishes', type : 'menu', isHeading : true
                    });

                    for( var i=0; i< dishesInResult.length; i++ ) {
                        var dish = dishesInResult[ i ];

                        typeAheadOptions.push({
                            menuTitle : dish.title, type : 'dish', isHeading: false
                        });
                    }


                }

                $scope.bannerDropDownOptions = typeAheadOptions;
            })
            .error( function( data ) {
                console.log( data );
            })
        } else {
            $scope.bannerDropDownOptions = $scope.backUpOfOpetions;
        }
    });

    $scope.getClassForSearchResult = function( aResult ) {
        if( aResult.isHeading ) {
            return 'heading';
        }
    };

    /* What do we do on input click */
    $scope.handleClickOnSearch = function( $event ) {
        $scope.shouldDropDownBeShown = true;

        $event.preventDefault();
        $event.stopPropagation();
    };

    /* Let's close it */
    $scope.closeOptionsDropDown = function( $event ) {
        $scope.shouldDropDownBeShown = false;

        $event.preventDefault();
        $event.stopPropagation();
    };

    /* Now, user has clicked on dropdown. What do we do ? */
    $scope.pickedCategory = function( menu ) {
        if( menu.menuTitle === 'Search By Location' ) {
            $modal.open({
                templateUrl : 'views/modals/location/locationModal.html',
                controller : 'LocationSelectModalController',
                resolve : {
                    displayedOnPage : function() {
                        return $scope.locations;
                    }
                }
            })
        }
    };
};


function LocationSelectModalController($scope, $modalInstance, $location, DataStore, AppConstants, RestRequests, $http, displayedOnPage ) {

    $scope.locations = displayedOnPage;

    $scope.serverError = false;

	$scope.closeLoginModal = function (){
        $modalInstance.close();
    };
	console.log("inside modal location");

    $scope.init = function() {
        var requestName = AppConstants.httpServicePrefix + '/' + RestRequests.locations;

        $http.get( requestName )
            .success( function( data ) {
                $scope.locations = data;
            })
            .error( function( data ){

            });
    };

    $scope.haveRecievedFromServer = function() {
        return $scope.serverError ? 'bg-danger' : 'noHeight';
    };

    /* Function to move to control over search page. */
    $scope.searchByLocation = function( location ) {

        var searchInfo = {
            type : 'location',
            text : location.name
        };

        DataStore.storeData( 'searchTaskInfo', searchInfo );
        $modalInstance.close('dismiss' );

        $location.path( 'search' );
    };

    $scope.init();
}