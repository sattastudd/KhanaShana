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
        checkUserExistance : 'email',
        addNewUser : 'users'

    })
	.constant('RegExProvider',  {
        
        name : /^[a-zA-Z ]{1,}$/

    })
    .service('AppUtils', function ($filter){
        this.isObjectEmpty = function (obj) {
            var toJson = $filter('json')(obj, 0).replace(/(\r\n|\n|\r)/gm, '');
            
            if (toJson === '{}')
                return true;
            return false;
        };
    })
	.service( 'ValidationService', function( RegExProvider ){
		// True -> Validation Failed.
		// False -> Validation Passed.

		this.isNameNotValid = function( name, isMandatory ) {

            if (isMandatory && (name === '' || null == name)) {
				return false;
            } else if (name === '') {
				return true;
			}

			var nameRegEx = RegExProvider.name;
            return !nameRegEx.test(name);
		}
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
	} );
} );
