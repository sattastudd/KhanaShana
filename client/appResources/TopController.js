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

		$scope.bannerDropDownOptions = data.dropdownMenu;
		$scope.locations = data.locations;
		$scope.cuisines = data.cuisines;

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
            templateUrl : 'views/login/loginModal.html',
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

    $scope.isUserLoggedIn = function() {
        if( DataStore.getData( 'loggedInUser' )){
            console.log('Returning true');
            return true;
        } else {
            console.log('Returning false');
            return false;
        }
    };
}

function LoginModalController($scope, $modalInstance, DataStore, $window, $http, AppConstants, RestRequests, ValidationService, AppUtils){
	$scope.user = {
		name : '',
		email : '',
		password : '',
		confirmPassword : '',
		contact : ''
	};

	$scope.err = {
		name : '',
		email : '',
		password : '',
		confirmPassword : '',
		contact : ''
	};

	$scope.errMsg = {
		name : '',
		email : '',
		password : '',
		confirmPassword : '',
		contact : ''
    };
    
    $scope.hasRecievedResponseFromServer = false;

    $scope.isSignUpFormNotActive = true;
    
    /*Depending upon isSignUpFormNotActive, we have to make sure sign up fields are at no height.*/
    $scope.getCSSCLassDependingOnSignUp = function () {
        if ($scope.isSignUpFormNotActive)
            return 'noHeight';
        return '';
    };
    
    /*Switch over to other form type.*/
    $scope.changeFormType = function (type) {
          
        if (type === 'login') {
            if ($scope.isSignUpFormNotActive) { return; }
            else {
                $scope.isSignUpFormNotActive = true;
                
                $scope.err = {};
                $scope.errMsg = {};
                $scope.adjustLinks(0);

                $scope.hasRecievedResponseFromServer = false;
                $scope.isServerError = false;
                $scope.serverResponse = '';
            }
        } else {
            if (!$scope.isSignUpFormNotActive) { return; }
            else {
                $scope.isSignUpFormNotActive = false;
                $scope.adjustLinks(1);

                $scope.err = {};
                $scope.errMsg = {};

                $scope.hasRecievedResponseFromServer = false;
                $scope.isServerError = false;
                $scope.serverResponse = '';
            }
        }
        
    };
    
    /*Depending upon isSignUpFormNotActive, we need to adjust button text as well.*/
    $scope.getButtonText = function () {
        return $scope.isSignUpFormNotActive ? 'Log In ' : 'Register';
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

    $scope.closeLoginModal = function (){
        $modalInstance.close();
    }

    $scope.loginSignUpUser = function () {
        if ($scope.isSignUpFormNotActive) {
            $scope.hasAnyValidationFailed = false;

            $scope.isEmailNotValid( true );
            $scope.isPasswordNotValid();

            if( !$scope.hasAnyValidationFailed ){
                var requestName = AppConstants.httpServicePrefix + '/' + RestRequests.login;

                $http.post( requestName, $scope.user )
                    .success( function( data ) {
                        console.log( data );

                        console.log('In Success');

                        $scope.hasRecievedResponseFromServer = true;
                        $scope.isServerError = false;
                        $scope.serverResponse = data.msg;

                        $window.sessionStorage.token = data.user.token;

                        DataStore.storeData( 'loggedInUser', data.user );

                        setTimeout( function() {
                                $scope.closeLoginModal();
                        }, 2000 );

                    })
                    .error( function( data ) {
                        $scope.err = data.err;
                        $scope.errMsg = data.errMsg;

                        if (AppUtils.isObjectEmpty(data.err)) {
                            $scope.hasRecievedResponseFromServer = true;
                            $scope.isServerError = true;
                            $scope.serverResponse = data.msg;
                        } else {
                            $scope.hasRecievedResponseFromServer = false;
                            $scope.isServerError = false;
                            $scope.serverResponse = '';
                        }
                    });
            }

        } else {
            $scope.hasAnyValidationFailed = false;

            $scope.isNameNotValid(true);
            $scope.isEmailNotValid(true);
            $scope.areTwoPasswordsNotSame();
            $scope.isContactNotValid(true);
            
            if (!$scope.hasAnyValidationFailed) {
                var requestName = AppConstants.httpServicePrefix + '/' + RestRequests.addNewUser;
                
                $http.post(requestName, $scope.user)
                .success(function (data) {
                    console.log('In Success');

                    $scope.changeFormType( 'login' );
                    
                    $scope.hasRecievedResponseFromServer = true;
                    $scope.isServerError = false;
                    $scope.serverResponse = data.msg;
                })
                .error(function (data) {
                    
                    $scope.err = data.err;
                    $scope.errMsg = data.errMsg;
                    
                    if (AppUtils.isObjectEmpty(data.err)) {
                        $scope.hasRecievedResponseFromServer = true;
                        $scope.isServerError = true;
                        $scope.serverResponse = data.msg;
                    } else {
                        $scope.hasRecievedResponseFromServer = false;
                        $scope.isServerError = false;
                        $scope.serverResponse = '';
                    }
                });
            }
        }
    };

    /*Valdation Getters Begin*/
    $scope.hasNameError = function () {
        
        return $scope.err.name ? '' : 'noHeight';
    };

    $scope.hasEmailError = function () {

        return $scope.err.email ? '' : 'noHeight';
    }

    $scope.hasPasswordError = function () {
        
        return $scope.err.password ? '' : 'noHeight';
    };

    $scope.hasContactError = function () {
        
        return $scope.err.contact ? '' : 'noHeight';
    };
    
    $scope.haveRecievedFromServer = function () {
        if ($scope.hasRecievedResponseFromServer) {
            if ($scope.isServerError) {
                return 'bg-danger';
            } else {
                return 'bg-success';
            }
        }
        
        return 'noHeight';
    };

    $scope.getRidOfErrorInLogin = function() {

        if( $scope.isSignUpFormNotActive && $scope.err.password){
            $scope.err.password = false;
        }
    };

    /*Validation Getters End*/
    
    /*Setting up Errors*/
    $scope.hasAnyValidationFailed = false;

    $scope.setUpError = function (err, errMsg, type, resultFromValidation) {
        
        $scope.hasAnyValidationFailed = true;

        err[type] = resultFromValidation.result;
        errMsg[type] = resultFromValidation.message;
    };
    
    $scope.removeError = function (err, errMsg, type) {
        err[type] = false;
        errMsg[type] = '';
    };

    $scope.isNameNotValid = function (isMandatory) {
        
        if (!isMandatory) {
            isMandatory = false;
        }
        
        var result = ValidationService.isNameNotValid($scope.user.name, isMandatory);
        
        if (result.result) {
            $scope.setUpError($scope.err, $scope.errMsg, 'name', result);
        } else {
            $scope.removeError($scope.err, $scope.errMsg, 'name');
        }
    };

    $scope.isEmailNotValid = function (isMandatory) {
        
        if (!isMandatory) {
            isMandatory = false;
        }
        
        var result = ValidationService.isEmailNotValid($scope.user.email, isMandatory);
        
        if (result.result) {
            $scope.setUpError($scope.err, $scope.errMsg, 'email', result);
        } else {
            $scope.removeError($scope.err, $scope.errMsg, 'email');

            if ($scope.isSignUpFormNotActive) {
                return;
            } else {
                var requestName = AppConstants.httpServicePrefix + '/' + RestRequests.checkUserExistence;
                
                $http.post(requestName, { email : $scope.user.email })
    			     .success(function (data) {
                    if (data.result) {
                        $scope.err.email = true;
                        $scope.errMsg.email = data.msg;
                    }
                })
    			     .error(function (data) {
                    console.log(data);
                });
            }
        }
    };

    $scope.isContactNotValid = function (isMandatory) {
        
        if(!isMandatory) {
            isMandatory = false;
        }
        
        var result = ValidationService.isContactNotValid($scope.user.contact, isMandatory);
        
        console.log(result);
        
        if (result.result) {
            $scope.setUpError($scope.err, $scope.errMsg, 'contact', result);
        } else {
            $scope.removeError($scope.err, $scope.errMsg, 'contact');
        }
    };

    $scope.areTwoPasswordsNotSame = function () {
        var result = !($scope.user.password === $scope.user.cfmPassword)
        
        if (result) {
            $scope.hasAnyValidationFailed = true;

            $scope.err.password = true;
            $scope.errMsg.password = 'Passwords do not match.';
        } else {
            $scope.err.password = false;
            $scope.errMsg.password = '';
        }
    };

    $scope.isPasswordNotValid = function() {
        var result = ValidationService.isFieldNotBlank( $scope.user.password );

        if( !result ) {
            $scope.hasAnyValidationFailed = true;

            $scope.err.password = true;
            $scope.errMsg.password = 'Field can not be left blank.';
        } else {
            $scope.err.password = false;
            $scope.errMsg.password = '';
        }
    };
}