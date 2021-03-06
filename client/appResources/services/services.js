'use strict';

define(['angular', '../require/route-config'], function (angular,
                                                         routeConfig, lazyDirectives) {

    return angular.module('khanaShanaApp',
        ['ngRoute', 'petooRamDirectives', 'ui.bootstrap'],
        function ($compileProvider, $controllerProvider) {

            routeConfig.setCompileProvider($compileProvider);
            routeConfig.setControllerProvider($controllerProvider);
        })
        .constant('AppConstants', {

            appName: 'KhanaShana',
            httpServicePrefix: 'node/public',
            requestCount: 'requestCount',
            sentRequestObj: 'sentRequestObj',
            loggedInUser: 'node/user'

        })
        .constant('RestRequests', {

            getDropDowns: 'globalData',
            checkUserExistence: 'email',
            addNewUser: 'users',
            login: 'login',
            searchResult: 'result',
            restaurantSearch: 'restaurant/search',
            typeahead: 'restaurant/typeahead',
            locations: 'locations',
            password: 'password',
            restaurant : 'restaurant',
            pendingOrder : 'orders/pending'

        })
        .constant('RegExProvider', {

            name: /^[a-zA-Z ]{1,}$/,
            email: /^[_A-Za-z0-9-\+]+(\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\.[A-Za-z0-9]+)*(\.[A-Za-z]{2,})$/,
            contactNumber: /^[1-9][0-9]{9,10}$/

        })
        .service('UserInfoProvider', function ($window, $location, DataStore) {

            this.isUserLoggedIn = function () {
                if (typeof $window.localStorage.user !== 'undefined')
                    return true;
                else
                    return false;
            };

            this.getLoggedInUserName = function () {
                if (this.isUserLoggedIn()) {
                    var user = JSON.parse($window.localStorage.user);

                    return user.name;
                }
                return null;
            };

            this.getLoggedInUserEmail = function () {
                if (this.isUserLoggedIn()) {
                    var user = JSON.parse($window.localStorage.user);

                    return user.email;
                }

                return null;
            };

            this.handleUserStatus = function () {
                if (!this.isUserLoggedIn())
                    $location.path('/');
            };

            this.logoutUser = function () {
                delete $window.localStorage.user;
                delete $window.localStorage.token;
            };

            this.isSessionExpired = function () {
                return DataStore.isKeyDefined('userStatus');
            };

            this.getSessionExpiredUserData = function () {
                var user = DataStore.getData('userStatus');
                DataStore.removeData('userStatus');

                return user;
            };
        })
        .service('AppUtils', function ($filter) {
            this.isObjectEmpty = function (obj) {
                var toJson = $filter('json')(obj, 0).replace(/(\r\n|\n|\r)/gm, '');

                if (toJson === '{}')
                    return true;
                return false;
            };
        })
        .service('ResponseMessage', function () {
            this.errorMessage = {
                someError: 'Some Error Occurred. Please try after some time.',
                userExists: 'User Already Exists.',
                name: 'Invalid Name',
                email: 'Invalid Email',
                mandatory: 'Field can not be left empty.',
                contact: 'Invalid Contact Number.',
                sessionExpired : 'Your session has expired.'
            }
        })
        .service('ValidationService', function (ResponseMessage, RegExProvider) {
            // True -> Validation Failed.
            // False -> Validation Passed.

            var isFieldNotValid = function (value, isMandatory, regEx, mandatoryMessage, regExFailMessage) {
                if (isMandatory && (value === '' || null == value)) {
                    return {result: true, message: mandatoryMessage};
                } else if (value === '') {
                    return {result: false};
                }

                var resultToReturn = !regEx.test(value);

                var message = resultToReturn ? regExFailMessage : '';

                return {result: resultToReturn, message: message};
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

            this.isFieldNotBlank = function (value) {
                return !(value === '' || null == value);
            };
        })
        .service('DataStore', function () {

            var storedData = {};

            this.isKeyDefined = function (key) {
                if (typeof storedData[key] !== 'undefined')
                    return true;
                else
                    return false;
            };

            this.storeData = function (key, value) {

                storedData[key] = value;
            };

            this.getData = function (key) {
                return storedData[key];
            };

            this.removeData = function (key) {

                delete storedData[key];
            };

            this.readAndRemove = function (key) {
                var value = null;

                if (this.isKeyDefined(key)) {
                    value = this.getData(key);
                    this.removeData(key);
                }

                return value;
            };


            this.getAllStoredData = function () {

                return storedData;
            };
        })
        .service('authInterceptor', function ($rootScope, $q, $window, AppConstants, DataStore, UserInfoProvider, ResponseMessage) {
            return {
                request: function (config) {
                    config.headers = config.headers || {};

                    if (DataStore.isKeyDefined(AppConstants.requestCount)) {
                        var requestCount = DataStore.getData(AppConstants.requestCount);

                        DataStore.storeData(AppConstants.requestCount, ++requestCount);
                    } else {
                        var overLaidElement = angular.element(document.querySelector('.overlay'));

                        overLaidElement.css({display: 'block'});
                        DataStore.storeData(AppConstants.requestCount, 0);
                    }

                    if (config.url.indexOf('node/') !== 0)
                        return config;

                    if ($window.localStorage.getItem('token')) {
                        config.headers.Authorization = 'Bearer ' + $window.localStorage.token;
                    }

                    return config;
                },

                response: function (response) {

                    var requestCount = DataStore.getData(AppConstants.requestCount);

                    DataStore.storeData(AppConstants.requestCount, --requestCount);

                    if (requestCount === 0) {

                        var overLaidElement = angular.element(document.querySelector('.overlay'));
                        overLaidElement.css({display: 'none'});

                    }
                    return response;
                },

                responseError: function (rejection) {
                    console.log(rejection);

                    console.log( rejection ) ;

                    if( rejection.status === 401 && rejection.data.data === 'TE' ){
                        /* Logging out user so as to avoid redirection.*/
                        UserInfoProvider.logoutUser();

                        DataStore.storeData( 'userStatus', {
                            user : rejection.data.user,
                            msg : ResponseMessage.sessionExpired
                        });

                        $rootScope.openLoginModal();
                    }

                    return $q.reject(rejection);
                }
            };
        });
});
