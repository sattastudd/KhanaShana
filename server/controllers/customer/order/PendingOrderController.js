/* This controller file will deal with pending order operations. */

var ServerConstants = require( '../../../constants/ServerConstants' );
var PendingOrderService = require( '../../../serviceLayer/customer/order/PendingOrdersService' );

var addOrderIntoPendingOrdersList = function( req, res, next ) {
    logger.info( 'In PendingOrderController | Starting Execution of addOrderIntoPendingOrdersList' );

    var userEmail = req.user.email;
    var restaurantInfo = {
        name : req.body.restaurant.name,
        slug : req.body.restaurant.slug
    };

    var orderDishes = req.body.dishes;

    PendingOrderService.addOrderIntoPendingOrdersList( userEmail, restaurantInfo, orderDishes, function( err, result ) {
        if( err ) {
            if( err === ServerConstants.appErrors.validationError ) {
                res.status( 400).json( result );
            } else {
                res.status( 500).json( result );
            }
        } else {
            res.status( 200 ).json( result );
        }
    });

    logger.info( 'In PendingOrderController | Finished Execution of addOrderIntoPendingOrdersList' );
};

exports.addOrderIntoPendingOrdersList = addOrderIntoPendingOrdersList;