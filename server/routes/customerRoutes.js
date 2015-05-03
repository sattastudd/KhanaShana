var CustomerAccountController = require( '../controllers/customer/account/CustomerAccountController' );

/* Request-Name : /user/password, Type : Get, Allowed : admin, user*/
/* This request would be used by users to change their password. */
router.post( '/user/password', function( req, res, next ){
    console.log( 'In adminRoutes | Handling ' + req.route.path );

    CustomerAccountController.changePassword( req, res, next );

    console.log( 'In adminRoutes | Finished ' + req.route.path );
});
