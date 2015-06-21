    'use strict';

    define( [ 'angular', '../require/route-config' ], function(angular,
            routeConfig, lazyDirectives) {

        return angular.module('petooRam',
                ['ngRoute', 'petooRamDirectives', 'ui.bootstrap', 'ngAnimate'],
                function ($compileProvider, $controllerProvider) {

            routeConfig.setCompileProvider($compileProvider);
            routeConfig.setControllerProvider($controllerProvider);
        })
        .constant('AppConstants', {

            appName : 'PetuRaam',
            httpServicePrefix : 'node',
            publicServicePrefix : 'node/public',
            adminServicePrefix : 'node/admin'

        })
        .constant('RestRequests', {

            login : 'login',
            stats : 'stats',
            options : 'options',
            userList : 'users',
            blackListUser : 'user/blacklist',
            createEditUser : 'user',
            userPasswordReset : 'user/reset',

            searchRestaurants : 'restaurants/search',

            restaurants : 'restaurants',
            restaurant : 'restaurant',

            approveRestaurant : 'restaurants/approve',

            cuisineSearch : 'cuisine/search',
            locationSearch : 'locations/search',

            newLocation : 'locations'
        })
        .constant('RegExProvider',  {

            name: /^[a-zA-Z ]{1,}$/,
            email: /^[_A-Za-z0-9-\+]+(\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\.[A-Za-z0-9]+)*(\.[A-Za-z]{2,})$/,
            contactNumber : /^[1-9][0-9]{9,10}$/,
            boolean : /^[true,false]{1,}$/

        })
        .service('AppUtils', function ($filter){
            this.isObjectEmpty = function (obj) {
                var toJson = $filter('json')(obj, 0).replace(/(\r\n|\n|\r)/gm, '');

                if (toJson === '{}')
                    return true;
                return false;
            };

            this.isFieldBlank = function( value ) {
              if( value === '' || null == value || typeof value === 'undefined' ){
                  return true;
              }
              return false;
            };
        })
        .service('ResponseMessage', function (){
            this.errorMessage = {
                name : 'Invalid Name',
                email : 'Invalid Email',
                boolean : 'Invalid value',
                mandatory : 'Field can not be left empty.',
                contact : 'Invalid Contact Number.',
                sessionExpired : 'Your session has expired.',
                noSearchCriteria : 'Please enter at least one search criteria.'
            };
        })
        .service( 'ValidationService', function(ResponseMessage, RegExProvider ){
            // True -> Validation Failed.
            // False -> Validation Passed.

            var isFieldNotValid = function (value, isMandatory, regEx, mandatoryMessage, regExFailMessage) {
                if (isMandatory && (value === '' || null == value)) {
                    return { result : true, message : mandatoryMessage };
                } else if (value === '') {
                    return { result : false };
                }

                var resultToReturn = !regEx.test(value);

                var message = resultToReturn ? regExFailMessage : '';

                return { result : resultToReturn, message : message };
            };

            this.isBooleanNotValid = function( value, isMandatory ) {
                return isFieldNotValid( value, isMandatory, RegExProvider.boolean, mandatoryMessage, errorMessage.boolean );
            };

            var mandatoryMessage = ResponseMessage.errorMessage.mandatory;
            var errorMessage = ResponseMessage.errorMessage;

            this.isNameNotValid = function (name, isMandatory) {
                return isFieldNotValid(name, isMandatory, RegExProvider.name, mandatoryMessage, errorMessage.name);
            };

            this.isEmailNotValid = function (email, isMadatory) {
                return isFieldNotValid(email, isMadatory, RegExProvider.email, mandatoryMessage, errorMessage.email);
            };

            this.isContactNotValid = function (contact, isMandatory) {
                return isFieldNotValid(contact, isMandatory, RegExProvider.contactNumber, mandatoryMessage, errorMessage.contact);
            };

            this.isFieldNotBlank = function( value ) {
                return !(value === '' || null == value);
            };
        } )
        .service( 'DataStore', function() {

            var storedData = {};

            this.isKeyDefined = function ( key ){
                if( typeof storedData[key] !== 'undefined' )
                    return true;
                else
                    return false;
            };

            this.storeData = function(key, value) {

                storedData[key] = value;
            };

            this.getData = function (key) {
                if (Array.isArray(storedData[key])) {
                    return storedData[key].slice();
                }
                return storedData[key];
            };

            this.readAndRemove = function( key ) {
                var value = null;

                if( this.isKeyDefined( key )){
                    value = this.getData( key );
                    this.removeData( key );
                };

                return value;
            };

            this.removeData = function(key) {

                delete storedData[key];
            };

            this.getAllStoredData = function() {

                return storedData;
            };
        } )
        .service( 'authInterceptor', function ($rootScope, $q, $window, $location, UserInfoProvider, DataStore, ResponseMessage) {
            return {
                request : function( config ) {
                    config.headers = config.headers || {};

                    if( config.url.indexOf( 'node/' ) !== 0)
                        return config;

                    if( $window.localStorage.getItem( 'token') ) {
                        config.headers.Authorization = 'Bearer ' + $window.localStorage.token;

                        console.log( 'Token Attached' );
                    } else {
                        console.log( 'No Token Found' );
                    }

                    return config;
                },

                responseError : function( rejection ){
                    console.log( rejection ) ;

                    if( rejection.status === 401 && rejection.data.data === 'TE' ){
                        /* Logging out user so as to avoid redirection.*/
                        UserInfoProvider.logoutUser();

                        DataStore.storeData( 'userStatus', {
                            user : rejection.data.user,
                            msg : ResponseMessage.errorMessage.sessionExpired
                        });

                        $location.path( '/login' );
                    }

                    return $q.reject(rejection);
                }
            };
        })
        .service( 'UserInfoProvider', function ( $window, $location, DataStore ){

            this.isUserLoggedIn = function (){
                if( typeof $window.localStorage.user !== 'undefined' )
                    return true;
                else 
                    return false;
            };

            this.getLoggedInUserName = function (){
                if( this.isUserLoggedIn() ) {
                    var user = JSON.parse( $window.localStorage.user );

                    return user.name;
                };
                return null;
            };

            this.getLoggedInUserEmail = function () {
                if( this.isUserLoggedIn() ){
                    var user = JSON.parse( $window.localStorage.user );

                    return user.email;
                }

                return null;
            };

            this.handleUserStatus = function () {
                if( !this.isUserLoggedIn())
                    $location.path( '/login');
            };

            this.handleLoggedInUser = function () {
                if( this.isUserLoggedIn()){
                    $location.path( '/dashboard' );
                }
            };

            this.logoutUser = function () {
                delete $window.localStorage.user;
                delete $window.localStorage.token;
            };

            this.isSessionExpired = function () {
                return DataStore.isKeyDefined( 'userStatus' );
            };

            this.getSessionExpiredUserData = function () {
                var user =  DataStore.getData( 'userStatus' );
                DataStore.removeData( 'userStatus' );

                return user;
            };
        });

    } );