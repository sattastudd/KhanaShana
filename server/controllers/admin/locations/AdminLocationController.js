/**
 * Controller file to do all Admin Location Related Tasks.
 */

var AdminLocationService = require( '../../../serviceLayer/admin/locations/AdminLocationService' );
var AppConstants = require( '../../../constants/ServerConstants' );

var getAllLocations = function( req, res, next ) {
    logger.info( 'In AdminLocationController | Starting Execution of getAllLocations' );

    var searchParam = {
        name : req.body.name
    };

    var pagingParams = {
        startIndex : req.body.startIndex
    };

    AdminLocationService.getAllLocations( searchParam, pagingParams, function( err, result ) {
        if( err ) {
            res.status( 500).json( result );
        } else {
            res.status( 200).json( result );
        }
    });

    logger.info( 'In AdminLocationController | Finished Execution of getAllLocations' );
};

/**
 * Public method to Add a New Location in the system.
 */
var addNewLocation = function( req, res, next ) {
    logger.info( 'In AdminLocationController | Starting Execution of addNewLocation' );

    var locationName = req.body.name;

    AdminLocationService.addNewLocation( locationName, function( err, result ) {
        if( err ) {
            if( err === AppConstants.appErrors.validationError ) {
                res.status( 400).json( result );
            } else {
                res.status( 500).json( result );
            }
        } else {
            res.status( 200).json( result );
        }
    });

    logger.info( 'In AdminLocationController | Finished Execution of addNewLocation' );
};

exports.getAllLocations = getAllLocations;
exports.addNewLocation = addNewLocation;