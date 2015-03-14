'use strict';

define( [ 'angular', '../require/route-config' ], function(angular,
		routeConfig, lazyDirectives) {

	return angular.module( 'khanaShanaApp',
			[ 'ngRoute', 'khanaShanaDirectives', 'ui.bootstrap' ],
			function($compileProvider, $controllerProvider) {

				routeConfig.setCompileProvider( $compileProvider );
				routeConfig.setControllerProvider( $controllerProvider );
			} )
	.constant( 'AppConstants', {

		appName : 'KhanaShana',
		httpServicePrefix : 'node/public'

	} )
	.constant( 'RestRequests', {

		getDropDowns : 'globalData',
		checkUserExistance : 'email'

	} )
	.constant( 'RegExProvider', {

		name : /[a-zA-Z ]/

	} )
	.service( 'ValidationService', function( RegExProvider ){
		// True -> Validation Failed.
		// False -> Validation Passed.

		this.isNameNotValid = function( name, isMandatory ) {

			if( isMandatory && ( name === '' || null == name ) ) {
				return false;
			} else if( name === '' ){
				return true;
			}

			var nameRegEx = RegExProvider.name;

			if( !nameRegEx.test( name )){
				return false;
			}

			return true;
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
