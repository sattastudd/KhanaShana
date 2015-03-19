    'use strict';

    define( [ 'angular', '../require/route-config' ], function(angular,
            routeConfig, lazyDirectives) {

        return angular.module('khanaShanaApp',
                ['ngRoute', 'khanaShanaDirectives', 'ui.bootstrap'],
                function ($compileProvider, $controllerProvider) {

            routeConfig.setCompileProvider($compileProvider);
            routeConfig.setControllerProvider($controllerProvider);
        })
        .constant('AppConstants', {

            appName : 'KhanaShana',
            httpServicePrefix : 'node/public'

        })
        .constant('RestRequests', {

            getDropDowns : 'globalData',
            checkUserExistence : 'email',
            addNewUser : 'users',
            login : 'login'

        })
        .constant('RegExProvider',  {

            name: /^[a-zA-Z ]{1,}$/,
            email: /^[_A-Za-z0-9-\+]+(\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\.[A-Za-z0-9]+)*(\.[A-Za-z]{2,})$/,
            contactNumber : /^[1-9][0-9]{9,10}$/

        })
        .service('AppUtils', function ($filter){
            this.isObjectEmpty = function (obj) {
                var toJson = $filter('json')(obj, 0).replace(/(\r\n|\n|\r)/gm, '');

                if (toJson === '{}')
                    return true;
                return false;
            };
        })
        .service('ResponseMessage', function (){
            this.errorMessage = {
                someError : 'Some Error Occurred. Please try after some time.',
                userExists: 'User Already Exists.',
                name : 'Invalid Name',
                email : 'Invalid Email',
                mandatory : 'Field can not be left empty.',
                contact : 'Invalid Contact Number.'
                }
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

            this.storeData = function(key, value) {

                storedData[key] = value;
                console.log( storedData );
            };

            this.getData = function(key) {

                console.log( storedData );
                return storedData[key];
            };

            this.removeData = function(key) {

                delete storedData[key];
            };

            this.getAllStoredData = function() {

                return storedData;
            };
        } )
        .service( 'authInterceptor', function ($rootScope, $q, $window) {
            return {
                request : function( config ) {
                    config.headers = config.headers || {};

                    console.log( config );

                    if( $window.localStorage.getItem( 'token') ) {
                        config.headers.Authorization = 'Bearer ' + $window.sessionStorage.token;

                        console.log( 'Token Attached' );
                    } else {
                        console.log( 'No Token Found' );
                    }

                    return config;
                },

                responseError : function( rejection ){
                    console.log( rejection ) ;

                    return $q.reject(rejection);
                }
            };
        });
    } );
