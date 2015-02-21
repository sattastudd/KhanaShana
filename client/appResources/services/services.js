'use strict';

define( [ 'angular', '../require/route-config' ], function(angular,
		routeConfig, lazyDirectives) {

	return angular.module( 'khanaShanaApp',
			[ 'ngRoute', 'khanaShanaDirectives', 'ui.bootstrap' ],
			function($compileProvider, $controllerProvider) {

				routeConfig.setCompileProvider( $compileProvider );
				routeConfig.setControllerProvider( $controllerProvider );
			} ).constant( 'AppConstants', {
		appName : 'KhanaShana',
		httpServicePrefix : 'node'
	} ).constant( 'RestRequests', {
		getDropDowns : 'getGlobalData'
	} ).service( 'DataStore', function() {

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
