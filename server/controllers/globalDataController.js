var BlueDart = require( '../dataTraveller/BlueDart' );

var async = require( 'async' );

var bannerDropDownModule = require( '../models/bannerDropDownModel' );
var locationsModule = require( '../models/locationsModel' );
var cuisinesModule = require( '../models/cuisinesModel' );

var query = {};
var projection = {
	'_id' : false
};

var getDropDownFromDB = function(callback) {

	console.log( 'In GlobalDataController | Entering getDropDownFromDB ' );

	var cityConnection = utils.getDBConnection( 'all' );

	bannerDropDownModule.setUpConnection( cityConnection );
	var BannerDropDownModel = bannerDropDownModule.getBannerDropDownModel();

	BannerDropDownModel.find( query, projection, function(err, dropdowns) {

		if ( err ) {
			callback( err );
		} else {
			callback( null, dropdowns );
		}
	} );

	console.log( 'In GlobalDataController | Exiting getDropDownFromDB ' );
};

var getLocationsFromDB = function(cityName, callback) {

	console.log( 'In GlobalDataController | Entering getLocationsFromDB' );

	var cityConnection = utils.getDBConnection( cityName );

	locationsModule.setUpConnection( cityConnection );
	var LocationsModel = locationsModule.getLocationModel();

	LocationsModel.find( query, projection, function(err, locations) {

		if ( err ) {
			callback( err );
		} else {
			callback( null, locations );
		}
	} );
	console.log( 'In GlobalDataController | Exiting getLocationsFromDB' );
};

var getCuisinesFromDB = function(cityName, callback) {

	console.log( 'In GlobalDataController | Executing getCuisinesFromDB' );

	var cityConnection = utils.getDBConnection( cityName );

	cuisinesModule.setUpConnection( cityConnection );
	var CuisinesModel = cuisinesModule.getCuisinesModel();

	CuisinesModel.find( query, projection, function(err, cuisines) {

		if ( err ) {
			callback( err );
		} else {
			callback( null, cuisines );
		}
	} );
	console.log( 'In GlobalDataController | Exiting getCuisinesFromDB' );
};

var finalCallBackFunction = function(response, err, results) {

	console.log( 'In GlobalDataController | Executing Final Callback ' );

	var blueDart = new BlueDart();

	if ( err ) {
		blueDart.setData( 'An Error Has Occurred' );
		blueDart.setMessage( 'Shit' );
		blueDart.setStatus( 500 );
	} else {
		var result = {
			'dropdownMenu' : results[0],
			'locations' : results[1],
			'cuisines' : results[2]
		};

		blueDart.setData( result );
		blueDart.setMessage( 'OK' );
		blueDart.setStatus( 200 );
	}

	response.send( blueDart );

	console
			.log( 'In GlobalDataController | Finished Execution of final Callback' );
};

var getGlobalData = function(request, response, next) {

	console.log( 'In GlobalDataController | Executing getGlobalData' );

	var cityName = request.body.cityName || 'lucknow';

	async.parallel( [ getDropDownFromDB,
			async.apply( getLocationsFromDB, cityName ),
			async.apply( getCuisinesFromDB, cityName ) ], async.apply(
			finalCallBackFunction, response ) );

	console
			.log( 'In GlobalDataController | Finished Executin of getGlobalData' );
};

exports.getGlobalData = getGlobalData;