var CustomerAccountController = require( '../controllers/customer/account/CustomerAccountController' );
var PendingOrdersController = require( '../controllers/customer/order/PendingOrderController' );

/* Request-Name : /user/password, Type : Put, Allowed : user, admin*/
/* This request would be used by users to change their password. */
router.put( '/user/password', function( req, res, next ){
    logger.info( 'In customerRoutes | Handling ' + req.route.path );

    CustomerAccountController.changePassword( req, res, next );

    logger.info( 'In customerRoutes | Finished ' + req.route.path );
});

/* Request-Name : /user/orders/pending, Type : Post, Allowed : user*/
/* This request would be used by users to add a order into pending orders list automatically. */
router.post( '/user/orders/pending', function( req, res, next ) {
    logger.info( 'In customerRoutes | Handling ' + req.route.path );

    PendingOrdersController.addOrderIntoPendingOrdersList( req, res, next );

    logger.info( 'In customerRoutes | Finished ' + req.route.path );
});

/* Request-Name : /user/orders, Type : Post, Allowed : user*/
/* This request would be used by users to add a order into pending orders list automatically. */
router.post( '/user/orders', function( req, res, next ) {
    PendingOrdersController.sendRequestToPayU( req, res, next );
});