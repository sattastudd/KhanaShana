/* This is a Database Interaction file Responsible for adding, editing, deleting a Location in a city..
 */

var LocationModelModule = require( '../../../models/locations/locationsModel' );
var RestaurantModelModule = require( '../../../models/locations/locationsModel' );

var DbUtils = require( '../../util/DBIUtil' );
var AppConstants = require( '../../../constants/ServerConstants' );

var async = require( 'async' );

/*                      Location Search Section Begin                    */
/*===========================================================================*/

/*              Private Methods             */
/*==========================================*/

/**
 * Private method to get total locations count.
 * It takes search parameters into account.
 * It would only be executed if user has initiated a fresh search.
 */
var getTotalLocationsCount = function( cityName, query, callback ) {
    logger.info( 'In AdminLocationDBI | Starting Execution of getTotalLocationsCount' );

    var cityDBConnection = utils.getDBConnection( cityName );

    LocationModelModule.setUpConnection( cityDBConnection );
    var LocationModel = LocationModelModule.getModel();

    LocationModel.count( query, function( err, count ) {
        if( err ) {
            callback( err );
        } else {
            callback( null, count );
        }
    } );

    logger.info( 'In AdminLocationDBI | Finished Execution of getTotalLocationsCount' );
};

/**
 * Private method to search on first retrieval of data.
 * This method is only called in case of fresh search.
 */
var getLocationsForFirstTime = function( cityName, query, projection, callback ) {
    logger.info( 'In AdminLocationDBI | Starting Execution of getLocationsForFirstTime' );

    var options = {
        limit : 10
    };

    var cityDBConnection = utils.getDBConnection( cityName );

    LocationModelModule.setUpConnection( cityDBConnection );
    var LocationModel = LocationModelModule.getModel();

    LocationModel.find( query, projection, options, function( err, result ) {
        if( err ) {
            callback( err );
        } else {
            callback( null, result );
        }
    });

    logger.info( 'In AdminLocationDBI | Finished Execution of getLocationsForFirstTime' );
};

/*                              Public Methods                         */
/*======================================================================*/
/** Public Method to search for locations. */
var getLocations = function( cityName, searchParams, pagingParams, callback ) {
    logger.info( 'In AdminLocationDBI | Finished Execution of getLocations' );

    var query = {};
    var projection = {};

    var name = searchParams.name;
    var isNameEmpty = DbUtils.isFieldEmpty( name );

    if( isNameEmpty ) {
        delete searchParams.name;
    } else {
        query.name = DbUtils.createCaseInsensitiveLikeString(name);
    }

    if( pagingParams.startIndex == 0 ) {
        async.parallel({
            count : async.apply( getTotalLocationsCount, cityName, query ),
            result : async.apply( getLocationsForFirstTime, cityName, query, projection )
        },
            function( err, result ) {
                if( err ) {
                    callback( err );
                } else {
                    callback( null, result );
                }
            });
    } else {

        var cityDBConnection = utils.getDBConnection( cityName );

        var options = {
            limit : 10,
            skip : pagingParams.startIndex
        };

        LocationModelModule.setUpConnection( cityDBConnection );
        var LocationModel = LocationModelModule.getModel();

        LocationModel.find( query, projection, options, function( err, result ) {
            if( err ) {
                callback( err );
            } else {
                callback( null, result );
            }
        });

    }

    logger.info( 'In AdminLocationDBI | Finished Execution of getLocations' );
};

/*                      Location Addition Section Begin                    */
/*=========================================================================*/

/*              Private Methods             */
/*==========================================*/

var isLocationAlreadyPresent = function( cityName, locationName, callback ) {
    logger.info( 'In AdminLocationDBI | Starting Execution of isLocationAlreadyPresent' );

    var query = {
        name : DbUtils.createCaseInsensitiveLikeString( locationName )
    };

    var cityDBConnection = utils.getDBConnection( cityName );

    LocationModelModule.setUpConnection( cityDBConnection );
    var LocationModel = LocationModelModule.getModel();

    LocationModel.count( query, function( err, count ) {
        if( err ) {
            callback( err );
        } else {
            if( count > 0 ) {
                callback( AppConstants.appErrors.existingLocation );
            } else {
                callback( null, false );
            }
        }
    });

    logger.info( 'In AdminLocationDBI | Finished Execution of isLocationAlreadyPresent' );
};

/**
 * Private Method to insert location into system.
 */
var insertLocationIntoSystem = function( cityName, locationName, isLocationAlreadyPresent, callback ) {
    logger.info( 'In AdminLocationDBI | Starting Execution of insertLocationIntoSystem' );

    if( !isLocationAlreadyPresent ) {

        var cityDBConnection = utils.getDBConnection( cityName );

        LocationModelModule.setUpConnection( cityDBConnection );
        var LocationModel = LocationModelModule.getModel();

        var Location = new LocationModel({
            name : locationName
        });

        Location.save( function( err, result ) {
            if( err ) {
                callback( err );
            } else {
                callback( null, result );
            }
        });

    } else {
        callback( AppConstants.appErrors.existingLocation );
    }

    logger.info( 'In AdminLocationDBI | Finished Execution of insertLocationIntoSystem' );
};

/*                              Public Methods                         */
/*======================================================================*/

var addNewLocation = function( cityName, location, callback ) {
    logger.info( 'In AdminLocationDBI | Starting Execution of addNewLocation' );

    async.waterfall([
        async.apply( isLocationAlreadyPresent, cityName, location),
        async.apply( insertLocationIntoSystem, cityName, location)
    ],
        function( err, result ) {
            if( err ) {
                callback( err );
            } else {
                callback( null, result );
            }
        });

    logger.info( 'In AdminLocationDBI | Finished Execution of addNewLocation' );
};

/*                      Location Deletion Section Begin                    */
/*=========================================================================*/

/*              Private Methods             */
/*==========================================*/

/**
 * Private method to count number of restaurants that deliver in particular area.
 * We can't allow a location to be deleted which is in use. It will break our functionality.
 */
var getLocationUsageCount = function( cityName, locationName, callback ) {
    logger.info( 'In AdminLocationDBI | Starting Execution of getLocationUsageCount' );

    var query = {
        delivery : DbUtils.createCaseInsensitiveLikeString( locationName )
    };

    var cityDBConnection = utils.getDBConnection( cityName );
    RestaurantModelModule.setUpConnection( cityDBConnection );

    var RestaurantModel = RestaurantModelModule.getModel();

    RestaurantModel.count( query, function( err, result ) {
        if( err ) {
            callback( err );
        } else {
            callback( null, result );
        }
    });

    logger.info( 'In AdminLocationDBI | Finished Execution of getLocationUsageCount' );
};

/**
 * Private method to delete a location.
 */
var deleteLocationFromSystem = function( cityName, locationName, locationUsageCount, callback ) {
    logger.info( 'In AdminLocationDBI | Finished Execution of deleteLocationFromSystem' );

    if( locationUsageCount === 0 ) {

        var query = {
            name : DbUtils.createCaseInSensitiveRegexString( locationName )
        };

        var cityDBConnection = utils.getDBConnection( cityName );
        LocationModelModule.setUpConnection( cityDBConnection );

        var LocationModel = LocationModelModule.getModel();

        LocationModel.delete( query, function( err, result ) {
            if( err ) {
                callback( err );
            } else {
                callback( null, result );
            }
        });

    } else {
        callback( AppConstants.appErrors.locationInUse );
    }

    logger.info( 'In AdminLocationDBI | Finished Execution of deleteLocationFromSystem' );
};

/*                              Public Methods                         */
/*======================================================================*/
/* Public method to delete a Location From System */
var deleteLocation = function( cityName, locationName, callback ) {
    logger.info( 'In AdminLocationDBI | Starting Execution of deleteLocation' );

    async.waterfall([
        async.apply( getLocationUsageCount, cityName, locationName ),
        async.apply( deleteLocationFromSystem, cityName, locationName )
    ],
        function( err, result ) {
            if( err ) {
                callback( err );
            } else {
                callback( null, result );
            }
        });

    logger.info( 'In AdminLocationDBI | Finished Execution of deleteLocation' );
};

exports.getLocations = getLocations;
exports.addNewLocation = addNewLocation;
exports.deleteLocation = deleteLocation;