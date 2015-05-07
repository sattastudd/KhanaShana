/* This controller would facilitate login related functionality like
 * Retrieve Restaurant Info
 *
 * Controllers have only task.
 * pick values from request object, and send them to service.
 * Where service validates and does everything.
 * And on response, controller happily sends the response to client.
 */

var RestaurantPublicService = require('../../serviceLayer/public/RestaurantPublicService' );

/* This method would restaurant info by slug field.
 */
var getRestaurantInfoBySlug = function( req, res, next ) {
    console.log( 'In RestaurantPublicController | Starting Execution of getRestaurantInfoBySlug' );

    var cityName = req.body.cityName || 'lucknow';
    var restaurantSlug = req.body.restaurantSlug;

    RestaurantPublicService.getRestaurantInfoBySlug(cityName, restaurantSlug, function( err, result ){
        if( err ){
            res.status( 500 )
                .json( result );
        } else {
            res.status( 200 )
                .json( result);
        }
    });

    console.log( 'In RestaurantPublicController | Finished Execution of getRestaurantInfoBySlug' );
};

exports.getRestaurantInfoBySlug = getRestaurantInfoBySlug;