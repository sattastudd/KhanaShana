define( [], function() {

	function TopController($scope) {

	}
	return TopController;
} );

function parentController($scope, $http, DataStore, AppConstants, RestRequests) {

	console.log( 'In parent Controller ' );

	$scope.search = {
		searchText : '',
		searchType : 'meal',
		searchPlaceHolder : 'Looking for meals ?'
	};

	$scope.bannerDropDownOptions = [];
	$scope.locations = [];
	/* Retriving DropDowns */
	$scope.dataFor = {
		'cityName' : 'lucknow'
	};

	var requestString = AppConstants.httpServicePrefix + '/'
			+ RestRequests.getDropDowns;

	$http.post( requestString, $scope.dataFor ).success( function(data) {

		$scope.bannerDropDownOptions = data.dataToCarry.data.dropdownMenu;
		$scope.locations = data.dataToCarry.data.locations;
		$scope.cuisines = data.dataToCarry.data.cuisines;

		DataStore.storeData( 'bannerDropDowns', $scope.bannerDropDownOptions );

		$scope.firstCuisines = $scope.cuisines[0];
	} ).error( function(data) {

		console.log( 'Error occurred ' );
		console.log( data );
	} );

	/* Header Controls */
	$scope.visibilityControl = {
		isHomePage : true,
		isSearchActive : true,
		isLocationSearchActive : false
	};

	/* Should Search Should Be Visible ? Due to Home Page */
	$scope.getIsNotHomePage = function() {

		return !$scope.visibilityControl.isHomePage;
	}

	/* Is Meal Search Currently Inactive */
	$scope.isSearchForMealInactive = function() {

		return $scope.visibilityControl.isHomePage ? 'false'
				: !$scope.visibilityControl.isSearchActive;
	};

	/* Is locationSearch InaActive */
	$scope.isSearchForLocationInactive = function() {

		return $scope.visibilityControl.isHomePage ? 'false'
				: !$scope.visibilityControl.isLocationSearchActive;
	};

	/* Activate Meal Search */
	$scope.showSearch = function() {

		/* We don't need you anymore searchText. */
		$scope.resetSearchText();

		$scope.visibilityControl.isSearchActive = true;
		$scope.visibilityControl.isLocationSearchActive = false;

		$scope.search.searchPlaceHolder = 'Looking for meals ?';
		$scope.search.type = 'meal';

		/* Someone needed a focus. */
		var smSearchBar = document.getElementById( 'smSearchNavBar' );
		smSearchBar.focus();
	};

	$scope.showLocationSearch = function() {

		/* We don't need you anymore searchText. */
		$scope.resetSearchText();

		$scope.visibilityControl.isSearchActive = false;
		$scope.visibilityControl.isLocationSearchActive = true;

		$scope.search.searchPlaceHolder = 'Lokking for locality ?';
		$scope.search.type = 'loc';

		/* Attention Seeker. */
		var smSearchBar = document.getElementById( 'smSearchNavBar' );
		smSearchBar.focus();
	};

	/* Search case on click on overlapper Meal Search */
	$scope.showOverLappedMealSearch = function() {

		$scope.search.searchPlaceHolder = 'Lokking for meal ?';
		$scope.search.type = 'mea;';

		$scope.dragOverLappedRow();
	};

	/* Search case on click on overLappedRow Location */
	$scope.showOverLappedLocationSearch = function() {

		$scope.search.searchPlaceHolder = 'Looging for locality ?';
		$scope.search.type = 'loc';

		$scope.dragOverLappedRow();
	}

	/* Restore overLappedRow above the navbar. */
	$scope.restorePosition = function() {

		var overLappedRow = angular.element( document
				.getElementById( 'overLappedRow' ) );

		overLappedRow.removeClass( 'moveToNormalPosition' );
	};

	/* Drag overLappedRow above the navbar. */
	$scope.dragOverLappedRow = function() {

		var overLappedRow = angular.element( document
				.getElementById( 'overLappedRow' ) );
		overLappedRow.addClass( 'moveToNormalPosition' );
	};

	/* Get Lost Search Text */
	$scope.resetSearchText = function() {

		$scope.search.searchText = '';
	};

	/* Set that we are at homepage and hide search. */
	$scope.setIsHomePage = function() {

		$scope.visibilityControl.isHomePage = true;
	};

	/* Set that we are not at hompage and show search. */
	$scope.setIsOtherPage = function() {

		$scope.visibilityControl.isHomePage = false;
	}

	/* User Home Page Style Determination */
	$scope.getClassForLg = function(index) {

		if ( index === 0 || index === 6 ) {
			return index === 6 ? 'col-sm-12 col-md-8 col-lg-8'
					: 'col-sm-6 col-md-8 col-lg-8';
		} else {
			return 'col-sm-6 col-md-4 col-lg-4';
		}
	};

	$scope.getImageSrcForLg = function(index, url) {

		var imageUrl = url.split( '.' );

		if ( index === 0 || index === 6 ) {
			return imageUrl[0] + '-lg.' + imageUrl[1];
		} else {
			return imageUrl[0] + '-lgs.' + imageUrl[1];
		}
	};

	$scope.getImageSrcForXs = function(index, url) {

		var imgUrl = url.split( '.' );

		return imgUrl[0] + '-lg.' + imgUrl[1];
	}
}