/* This is DB Interaction file for public data transactions.
 */
var appConstants = require( '../../constants/ServerConstants' );

var bannerDropDownModule = require( '../../models/banner/bannerDropDownModel' );
var locationsModule = require( '../../models/locations/locationsModel' );
var cuisinesModule = require( '../../models/cuisines/cuisinesModel' );

var async = require( 'async' );

/* 				    Global Module Variables				*/
/*======================================================================================*/
var query = {
    isOnHomePage : true
};

var projection = {
	'_id' : false,
    "__v" : false,
    dateModified : false,
    isOnHomePage : false
};

/*					Utility Methods					*/
/*======================================================================================*/

/*					Private Methods					*/
/*======================================================================================*/

/* This private method is responsible for retrieving banner dropdowns from DB.
 */
var getDropDownFromDB = function( callback ) {
	
	logger.info( 'In publicDBI | Starting Execution of getDropDownFromDB' );

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

	logger.info( 'In publicDBI | Finished Execution of getDropDownFromDB' );
};

/* This private method is responsible for retrieving locations for city in DB.
 */
var getLocationsFromDB = function( dbName, callback ) {
	logger.info( 'In publicDBI | Starting Execution of getLocationsFromDB' );

	var dbConnection = utils.getDBConnection( dbName );

	locationsModule.setUpConnection( dbConnection );
    var LocationsModel = locationsModule.getModel();

    var options = {
        limit : 10,
        sort : {
            dateModified : -1
        }
    };

	LocationsModel.find( query, projection, options, function( err, locations ) {
		
		if( err ) {
			callback( err );
		} else {
			callback( null, locations );
		}
	});

	logger.info( 'In publicDBI | Finished Execution of getLocationsFromDB' );
};

/* This private method is responsible for retrieving cuisines from DB.
 */
var getCuisinesFromDB = function( dbName, callback ) {
	
	logger.info( 'In publicDBI | Starting Execution of getCuisinesFromDB' );

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

	logger.info( 'In publicDBI | Finished Execution of getCuisinesFromDB' );
};

/*				    Final Callback Methods				*/
/*======================================================================================*/
/* This method would be executed when getDropDownsFromDB, getLocationsFromDB, getCuisinesDB have 
 * finished execution.
 * This method would be used to return control to service layer.
 */
var finalCallBackForFirstCall = function( callBackFromService, err, results ) {
	
	logger.info( 'In publicDBI | Starting Execution of finalCallBackForFirstCall' );

	if( err ) {
		logger.error( err );
		callBackFromService( err );
	} else {
		var result = {
			'dropDownMenu' : results[0],
			'locations' : results[1],
			'cuisines' : results[2]
		};

		callBackFromService( null, result );
	}

	logger.info( 'In publicDBI | Finished Execution of finalCallBackForFirstCall' );
};

/*					Public Methods					*/
/*======================================================================================*/
/* This is public method responsible for executing processes in parallel to retrieve required data.
 */
var getGlobalDataForFirstCall = function( dbName, callback ) {
	
	logger.info( 'In publicDBI | Starting Execution of getGlobalDataForFirstCall' );
	
	async.parallel( [ getDropDownFromDB,
		async.apply( getLocationsFromDB, dbName ),
		async.apply( getCuisinesFromDB, dbName ) ],
		async.apply( finalCallBackForFirstCall, callback ) );

	logger.info( 'In publicDBI | Finished Execution of getGlobalDataForFirstCall' );
};

/* Public Method to get all locations from Database.
 * This method would be used without limit on size to get all locations at once.
 */
var getAllLocations = function( cityName, callback ) {
    logger.info( 'In publicDBI | Starting Execution of getGlobalDataForFirstCall' );

    var cityDBConnection = utils.getDBConnection( cityName );

    locationsModule.setUpConnection( cityDBConnection );
    var LocationsModel = locationsModule.getModel();

    LocationsModel.find({}, projection, function( err, result ) {
        if( err ) {
            callback( err );
        } else {
            callback( null, result );
        }
    });

    logger.info( 'In publicDBI | Finished Execution of getGlobalDataForFirstCall' );
};

/*										Exports In Progress Methods									*/
/*==================================================================================================*/
exports.getGlobalData = getGlobalDataForFirstCall;
exports.getAllLocations = getAllLocations;