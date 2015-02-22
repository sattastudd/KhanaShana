define( [], function() {

	function userHomeController($scope) {

	}
	return userHomeController;
} );

function homeController($scope, $http, DataStore, AppConstants, RestRequests) {

	$scope.search = {
		searchText : ''
	};

	$scope.canSelectionDropDownBeOpened = true;

	/* Retriving dropdown options from DataStore */
	$scope.bannerDropDownOptions = DataStore.getData( 'bannerDropDowns' );

    console.log($scope.bannerDropDownOptions);
    
    if (typeof $scope.bannerDropDownOptions === 'undefined') {
        console.log('Got Undefined from DataStore | Falling back to back up.')
        $scope.bannerDropDownOptions = [
            {menuTitle: "Search By Location", type: "loc"},
            { menuTitle: "Search All Restaurants", type: "rest" }
        ];
    }

	$scope.handleClickOnSearch = function($event) {

		if ( $scope.search.searchText.length == 0
				&& $scope.canSelectionDropDownBeOpened ) {
			$scope.firstClickHandled = true;
			$scope.canSelectionDropDownBeOpened = false;

			$event.stopPropagation();
		}
	};

	$scope.closeOptionsDropDown = function($event) {

		if ( $scope.firstClickHandled == true ) {
			$scope.firstClickHandled = false;

			$event.stopPropagation();
		}
	};

	$scope.pickedCategory = function(menu) {

		console.log( menu );
		var bannerSearch = document.getElementById( 'bannerSearch' );

		$scope.firstClickHandled = false;

		bannerSearch.focus();
	};

	/*
	 * We need a watch over the content of Banner Search as we need to determine
	 * if the length has shortened.
	 */
	$scope.$watch( function() {

		return $scope.search.searchText;
	}, function(currentValue, prevValue) {

		if ( currentValue.length === 0
				&& ( prevValue.length > currentValue.length ) ) {
			$scope.canSelectionDropDownBeOpened = true;
		} else if ( currentValue.length > 0 ) {
			$scope.firstClickHandled = false;
		}
	} );

	var request = AppConstants.httpServicePrefix + '/'
			+ RestRequests.getDropDowns;
}