/* This is DB Interaction file for public data transactions.
 */
var appConstants = require( '../../constants/ServerConstants' );

var bannerDropDownModule = require( '../../models/banner/bannerDropDownModel' );
var locationsModule = require( '../../models/locations/locationsModel' );
var cuisinesModule = require( '../../models/cuisines/cuisinesModel' );

var async = require( 'async' );

/* 				    Global Module Variables				*/
/*======================================================================================*/
var query = {};

var projection = {
	'_id' : false
};

/*					Utility Methods					*/
/*======================================================================================*/

/*					Private Methods					*/
/*======================================================================================*/

/* This private method is responsible for retrieving banner dropdowns from DB.
 */
var getDropDownFromDB = function( callback ) {
	
	console.log( 'In publicDBI | Starting Execution of getDropDownFromDB' );

	var globalDBConnection = utils.getDBConnection( appConstants.globalDataBase );

	bannerDropDownModule.setUpConnection( globalDBConnection );
	var BannerDropDownModel = bannerDropDownModule.getBannerDropDownModel();

	BannerDropDownModel.find( query, projection, function( err, dropdowns ) {

		if( err ) {
			callback( err );
		} else {
			callback( null, dropdowns );
		}
	});

	console.log( 'In publicDBI | Finsished Execution of getDropDownFromDB' );
};

/* This private method is responsible for retrieving locations for city in DB.
 */
var getLocationsFromDB = function( dbName, callback ) {
	console.log( 'In publicDBI | Starting Execution of getLocationsFromDB' );

	var dbConnection = utils.getDBConnection( dbName );

	locationsModule.setUpConnection( dbConnection );
    var LocationsModel = locationsModule.getModel();

	LocationsModel.find( query, projection, function( err, locations ) {
		
		if( err ) {
			callback( err );
		} else {
			callback( null, locations );
		}
	});

	console.log( 'In publicDBI | Finished Execution of getLocationsFromDB' );
};

/* This private method is responsible for retriving cuisines from DB.
 */
var getCuisinesFromDB = function( dbName, callback ) {
	
	console.log( 'In publicDBI | Starting Execution of getCuisinesFromDB' );

	var dbConnection = utils.getDBConnection( dbName );

	cuisinesModule.setUpConnection( dbConnection );
	var CuisinesModel = cuisinesModule.getModel();

	CuisinesModel.find( query, projection, function( err, cuisines ) {
		
		if( err ) {
			callback( err );
		} else {
			callback( null, cuisines );
		}
	} );

	console.log( 'In publicDBI | Finished Execution of getCuisinesFromDB' );
};

/*				    Final Callback Methods				*/
/*======================================================================================*/
/* This method would be executed when getDropDownsFromDB, getLocationsFromDB, getCuisinesDB have 
 * finished execution.
 * This method would be used to return control to service layer.
 */
var finalCallBackForFirstCall = function( callBackFromService, err, results ) {
	
	console.log( 'In publicDBI | Starting Execution of finalCallBackForFirstCall' );

	if( err ) {
		console.log( err );
		callBackFromService( err );
	} else {
		var result = {
			'dropDownMenu' : results[0],
			'locations' : results[1],
			'cuisines' : results[2]
		};

		callBackFromService( null, result );
	}

	console.log( 'In publicDBI | Finished Execution of finalCallBackForFirstCall' );
};

/*					Public Methods					*/
/*======================================================================================*/
/* This is public method responsible for executing processes in parallel to retrieve required data.
 */
var getGlobalDataForFirstCall = function( dbName, callback ) {
	
	console.log( 'In publicDBI | Starting Execution of getGlobalDataForFirstCall' );
	
	async.parallel( [ getDropDownFromDB,
		async.apply( getLocationsFromDB, dbName ),
		async.apply( getCuisinesFromDB, dbName ) ],
		async.apply( finalCallBackForFirstCall, callback ) );

	console.log( 'In publicDBI | Finished Execution of getGlobalDataForFirstCall' );
};

/*										Exports In Progress Methods									*/
/*==================================================================================================*/
exports.getGlobalData = getGlobalDataForFirstCall;