/* This is a Database Interaction file Responsible for adding, editing, deleting a Location in a city..
 */

var LocationModelModule = require( '../../../models/locations/locationsModel' );

var DbUtils = require( '../../util/DBIUtil' );
var AppConstants = require( '../../../constants/ServerConstants' );

var async = require( 'async' );

/*                      Cuisine Search Section Begin                    */
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

exports.getLocations = getLocations;