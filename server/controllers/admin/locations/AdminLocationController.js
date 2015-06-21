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

    var location = {
        locationName: req.body.name,
        isOnHomePage: req.body.isOnHomePage
    };

    AdminLocationService.addNewLocation( location, function( err, result ) {
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

/**
 * Public method to delete a location.
 */
var deleteLocation = function( req, res, next ) {
    logger.info( 'In AdminLocationController | Starting Execution of deleteLocation' );

    var locationName = req.params.locationName;

    AdminLocationService.deleteLocation( locationName, function( err, result ) {
        if( err ) {
            res.status( 500).json( result );
        } else {
            res.status( 200).json( result );
        }
    });

    logger.info( 'In AdminLocationController | Finished Execution of deleteLocation' );
};

/**
 * Public method to update a location.
 */
var updateLocation = function( req, res, next ) {
    logger.info( 'In AdminLocationController | Starting Execution of updateLocation' );

    var oldLocationObject = req.body.old;
    var newLocationObject = req.body.new;

    AdminLocationService.updateLocation( oldLocationObject, newLocationObject, function( err, result ) {
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

    logger.info( 'In AdminLocationController | Finished Execution of updateLocation' );
};

exports.getAllLocations = getAllLocations;
exports.addNewLocation = addNewLocation;
exports.deleteLocation = deleteLocation;
exports.updateLocation = updateLocation;