/* This controller would facilitate login related functionality like
 * Retrieve Restaurant Info
 *
 * Controllers have only task.
 * pick values from request object, and send them to service.
 * Where service validates and does everything.
 * And on response, controller happily sends the response to client.
 */

var ServerConstants = require( '../../constants/ServerConstants' );

var RestaurantPublicService = require('../../serviceLayer/public/RestaurantPublicService' );

/* This method would restaurant info by slug field.
 */
var getRestaurantInfoBySlug = function( req, res, next ) {
    logger.info( 'In RestaurantPublicController | Starting Execution of getRestaurantInfoBySlug' );

    var cityName = req.body.cityName || 'lucknow';
    var restaurantSlug = req.body.restaurantSlug;

    RestaurantPublicService.getRestaurantInfoBySlug(cityName, restaurantSlug, function( err, result ){
        if( err ){

            if( err === ServerConstants.appErrors.validationError ) {
                res.status( 400 ).json( result );
            } else {
                res.status( 500 ).json( result );
            }
        } else {
            res.status( 200 )
                .json( result);
        }
    });

    logger.info( 'In RestaurantPublicController | Finished Execution of getRestaurantInfoBySlug' );
};

/* Public Method to search for restaurants. */
var searchRestaurants = function( req, res, next ) {
    logger.info( 'In RestaurantPublicController | Starting Execution of searchRestaurants' );

    var searchParams = {
        location : req.body.location
    };

    var pagingParams = {
        startIndex : req.body.startIndex
    };

    RestaurantPublicService.searchRestaurants( searchParams, pagingParams, function( err, result ) {
        if( err ) {
            if( err === ServerConstants.appErrors.validationError ) {
                res.status( 400 ).json( result );
            } else {
                res.status( 500 ).json( result );
            }
        } else {
            res.status( 200 ).json( result );
        }
    });

    logger.info( 'In RestaurantPublicController | Finished Execution of searchRestaurants' );
};

exports.getRestaurantInfoBySlug = getRestaurantInfoBySlug;
exports.searchRestaurants = searchRestaurants;