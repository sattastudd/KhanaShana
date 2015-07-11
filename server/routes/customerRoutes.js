var CustomerAccountController = require( '../controllers/customer/account/CustomerAccountController' );

/* Request-Name : /user/password, Type : Put, Allowed : user, admin*/
/* This request would be used by users to change their password. */
router.put( '/user/password', function( req, res, next ){
    logger.info( 'In customerRoutes | Handling ' + req.route.path );

    CustomerAccountController.changePassword( req, res, next );

    logger.info( 'In customerRoutes | Finished ' + req.route.path );
});