define( [], function() {

	function TopController($scope) {

	}
	return TopController;
} );

function parentController($scope, $rootScope, $http, DataStore, AppConstants, RestRequests, $modal, $window, $timeout, $location) {

    /* Modify search box visibility on location change. */
    $rootScope.$on('$locationChangeStart', function( event, next, current ){

        var retrievedPath = next.split('#')[1];

        if( retrievedPath !== '/'){
            $scope.visibilityController.isHomePage = false;
        } else {
            $scope.visibilityController.isHomePage = true;
        }
    });

	$scope.search = {
		searchText : '',
		searchType : 'meal',
		searchPlaceHolder : 'Looking for meals ?'
	};

	$scope.bannerDropDownOptions = [];
	$scope.locations = [];
	$scope.dataFor = {
		'cityName' : 'lucknow'
	};

    /*                      Rest Requests Section                      */
    /*==================================================================/
     */
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

    /*                       Page Utility Section                      */
    /*==================================================================/
     */
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
    };

    /*Delayed delete of the user. So the context menu does not shows up undefined.*/
    $scope.delayedDelete = function () {
        $timeout( function () {
            DataStore.removeData( 'loggedInUser' );
            delete $window.localStorage['user'];
        }, 1000);
    };

    /*Page Navigation Controller */
    $scope.goToHome = function(){
        $location.path( '/' );
    };

    /*                 Page Core Functionality Section                 */
    /*==================================================================/
     */
    /*OpenLoginModal*/
    $scope.openLoginModal = function () {
        var modalInstance = $modal.open({
            templateUrl : 'loginModal.html',
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

    /*                      Page Header Section                      */
    /*==================================================================/
     */

    $scope.isUserContextMenuOpen = false;

    $scope.visibilityController = {
        isHomePage : true,
        isLocationSearcNotActive : true
    };

    /* This method decides whether to show input box on the page.*/
    $scope.isHomePageNotActive = function () {
        return !$scope.visibilityController.isHomePage;
    };

    /* This method would provide the necessary style css for animation of search toggle. */
    $scope.adjustMargin = function (type) {
        return type==='search' ? ($scope.visibilityController.isLocationSearcNotActive ? 'negativeTopMargin50' : '' )
            :
            ( $scope.isUserLoggedIn() ? 'negativeTopMargin50' : '');
    };

    /* This method would provide necessary style css for login toggle. */
    $scope.getShrinkClass = function ( ){
        return $scope.isUserLoggedIn() ? 'shrinked' : '';
    };

    /* Search case on click on overlapper Meal Search */
    $scope.showOverLappedMealSearch = function() {

        $scope.search.searchPlaceHolder = 'Lokking for meal ?';
        $scope.search.type = 'mea;';

        $scope.dragOverLappedRow();
    };

    /* Search case on click on overLappedRow Location */
    $scope.showOverLappedLocationSearch = function() {

        $scope.search.searchPlaceHolder = 'Looking for locality ?';
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

    /* This method actives meal search */
    $scope.makeMealSearchActive = function () {
        $scope.visibilityController.isLocationSearcNotActive = true;

        $scope.search.searchText = '';
        $scope.search.searchType = 'meal';
        $scope.search.searchPlaceHolder = 'Looking for meal ?';
    };

    /* This method actives location search */
    $scope.makeLocationSearchActive = function(){
        $scope.visibilityController.isLocationSearcNotActive = false;

        $scope.search.searchText = '';
        $scope.search.searchType = 'loc';
        $scope.search.searchPlaceHolder = 'Looking for locality ?';
    };

    /* We have stored use login info in window.localStorage.
     * LocalStorage has advantages over others, as data will remain for infinite time.
     * We need to delete it manually.
     * 
     * Method would return true, if sucd data exists.
     */
    $scope.isUserLoggedIn = function() {
        if( DataStore.getData( 'loggedInUser' ) || $window.localStorage.user ){
            return true;
        } else {
            return false;
        }
    };

    /* Retrieve user name from the localStorage.
     * LocalStorage is restricted to storing only string.
     * We need to have some other mechanism for it.
     * So, while storing the data into localStorage,
     * We stringify the object, store it in string form,
     * And while reading, parse it into an object.
     */
    $scope.getUserName = function () {
        if( typeof DataStore.getData( 'loggedInUser' ) === 'undefined' && typeof $window.localStorage.user === 'undefined' ){
            return '';
        }
        var user = DataStore.getData( 'loggedInUser' ) || JSON.parse($window.localStorage.user);

        return user.name;
    };

    $scope.toggleUserContextMenu = function () {
        $scope.isUserContextMenuOpen = !$scope.isUserContextMenuOpen;
    };

    $scope.getClassForUserContext = function () {
        return $scope.isUserContextMenuOpen ? '' : 'noHeight';
    };

    $scope.logoutUser = function () {

        $scope.isUserContextMenuOpen = false;

        $http.post( 'node' + '/' + 'user/logout' , {})
            .success( function ( data ) {

                console.log( data.msg );

                $scope.delayedDelete();
                delete $window.localStorage['token'];
            })
            .error( function ( data ) {
                console.log( data ) ;

                $scope.delayedDelete();
                delete $window.localStorage['token'];
            });
    };
}

function LoginModalController($scope, $modalInstance, $location, DataStore, $window, $http, AppConstants, RestRequests, ValidationService, AppUtils){
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
    
    /* Is there any response from server.*/
    $scope.hasRecievedResponseFromServer = false;

    /* Which form is active right now ? */
    $scope.isSignUpFormNotActive = true;
    
    /*Depending upon isSignUpFormNotActive, we have to make sure sign up fields are at no height.*/
    $scope.getCSSCLassDependingOnSignUp = function () {
        if ($scope.isSignUpFormNotActive)
            return 'noHeight';
        return '';
    };

    //fogot password function
    $scope.showForgotPwd = true;
    $scope.forgotPwd = function(){
        $location.path('/forgotPassword');
        $scope.closeLoginModal();
    }
    
    /*Switch over to other form type.*/
    $scope.changeFormType = function (type) {
          
        if (type === 'login') {
            /* If login is already active ? */
            if ($scope.isSignUpFormNotActive) { return; }
            else {

                $scope.isSignUpFormNotActive = true;
                
                /* It is important that we forget all error before moving on. */
                $scope.err = {};
                $scope.errMsg = {};
                $scope.adjustLinks(0);

                /* So, is to forget serverResponses */
                $scope.hasRecievedResponseFromServer = false;
                $scope.isServerError = false;
                $scope.serverResponse = '';

                //forgot password
                $scope.showForgotPwd = true;
            }
        } else {
            //forgot password
            $scope.showForgotPwd = false;

            if (!$scope.isSignUpFormNotActive) { return; }
            else {
                $scope.isSignUpFormNotActive = false;
                $scope.adjustLinks(1);

                /* It is important that we forget all error before moving on. */
                $scope.err = {};
                $scope.errMsg = {};

                /* So, is to forget serverResponses */
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

    /* Close Login Modal. */
    $scope.closeLoginModal = function (){
        $modalInstance.close();
    }

    /* This method acts for login and sign up both.
     */
    $scope.loginSignUpUser = function () {
        /* Which form is active right now ? */
        if ($scope.isSignUpFormNotActive) {
            $scope.hasAnyValidationFailed = false;

            /* Now, this is compulsory check.*/
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

                        /* Storing token into localStorage */
                        $window.localStorage.token = data.user.token;

                        delete data.user.token;
                        $window.localStorage.user = JSON.stringify(data.user);

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