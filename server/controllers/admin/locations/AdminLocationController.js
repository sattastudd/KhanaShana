/**
 * Controller file to do all Admin Location Related Tasks.
 */

var AdminLocationService = require( '../../../serviceLayer/admin/locations/AdminLocationService' );

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

exports.getAllLocations = getAllLocations;