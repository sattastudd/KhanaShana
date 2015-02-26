define( [], function() {

	function TopController($scope) {

	}
	return TopController;
} );

function parentController($scope, $http, DataStore, AppConstants, RestRequests, $modal) {

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
    
    /*Depending Upon the image Path Reported, append -lg for larger grid and -lgs for smaller. | Convention*/
	$scope.getImageSrcForLg = function(index, url) {

		var imageUrl = url.split( '.' );

		if ( index === 0 || index === 6 ) {
			return imageUrl[0] + '-lg.' + imageUrl[1];
		} else {
			return imageUrl[0] + '-lgs.' + imageUrl[1];
		}
	};
    
    /*Depending Upon the image Path Reported, append -lg  | Convention*/
	$scope.getImageSrcForXs = function(index, url) {

		var imgUrl = url.split( '.' );

		return imgUrl[0] + '-lg.' + imgUrl[1];
    }

    /*OpenLoginModal*/
    $scope.openLoginModal = function () {
        var modalInstance = $modal.open({
            templateUrl : 'views/loginModal.html',
            controller : 'LoginModalController',
            backdrop : 'static',
            windowClass    : 'darkTransparentBack',
            size : 'sm'
        });
        
        /*To make rest of the page blurred.*/
        var contentContainer = angular.element(document.querySelector('#contentContainer'));
        contentContainer.addClass('blurredBack');

        modalInstance.result.then(function (data) {
            
            /*On modal close, we want to remove the blurred.*/
            contentContainer.removeClass('blurredBack');
        }, function (data) {
            /*On modal close, we want to remove the blurred.*/
            contentContainer.removeClass('blurredBack');
        });
    };
}

function LoginModalController($scope, $modalInstance){
    $scope.isSignUpFormNotActive = true;
    
    /*Depending upon isSignUpFormNotActive, we have to make sure sign up fields are at no height.*/
    $scope.getCSSCLassDependingOnSignUp = function (){
        if ($scope.isSignUpFormNotActive)
            return 'noHeight';
        return '';
    }
    
    /*Switch over to other form type.*/
    $scope.changeFormType = function (type) {
          
        if (type === 'login') {
            if ($scope.isSignUpFormNotActive) { return; }
            else {
                $scope.isSignUpFormNotActive = true;
                $scope.adjustLinks(0);
            }
        } else {
            if (!$scope.isSignUpFormNotActive) { return; }
            else {
                $scope.isSignUpFormNotActive = false;
                $scope.adjustLinks(1);
            }
        }
        
    };
    
    /*Depending upon isSignUpFormNotActive, we need to adjust button text as well.*/
    $scope.getButtonText = function () {
        return $scope.isSignUpFormNotActive ? 'Sign In ' : 'Sign Up';
    };
    
    /* This really should not be here.
     * But for the sake of simplicity, it is.
     * We retrive all the login links, remove the active class from all of its children.
     * Then on the index received, we put up active class.
     */
    $scope.adjustLinks = function (index) {

        var loginLinks = angular.element(document.querySelector('.login-links'));

        loginLinks.children().removeClass('active');
        loginLinks.children().eq(index).addClass('active');
    }
}