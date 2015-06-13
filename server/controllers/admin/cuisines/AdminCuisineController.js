/*Controller is responsible for forwarding data to service layer.
 *And upon receiving, send the data back to client.
 */

var appConstants = require('../../../constants/ServerConstants');

var AdminCuisineService = require( '../../../serviceLayer/admin/cuisines/AdminCuisineService' );

var getCuisines = function( req, res, next ) {
    logger.info( 'In AdminCuisineController | Starting Execution of getCuisines' );

    var searchParam = {
        name : req.body.name
    };

    var pagingParam = {
        startIndex : req.body.startIndex
    };

    AdminCuisineService.getCuisines( searchParam, pagingParam, function( err, result ) {
        if( err ) {
            if( err === appConstants.appErrors.validationError ) {
                res.status( 400).json( result );
            } else {
                res.status( 500).json( result );
            }
        } else {
            res.status( 200).json( result );
        }
    });

    logger.info( 'In AdminCuisineController | Finished Execution of getCuisines' );
};

exports.getCuisines = getCuisines;