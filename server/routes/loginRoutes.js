var loginController = require( '../controllers/loginController' );

/* GET /cities listing. */
/* Request-Name : /public/getGlobalData, Type : Post, Allowed : public*/
router.post( '/public/login',
		function(req, res, next) {

			console.log( 'In loginRoutes | Handling ' + req.route.path );

			loginController.loginUser( req, res, next );

			console.log( 'In loginRoutes | Complted Processing for '
					+ req.route.path );
		} );

/* Request-Name : /public/isUserAlreadyPresent, Type : Post, Allowed : public*/
router.post( '/public/isUserAlreadyInSystem', function( req, res, next) {

	console.log( 'In loginRoutes | Handling ' + req.route.path );

	loginController.isUserAlreadyInSystem( req, res, next );

	console.log( 'In loginRoutes | Completed Processing for ' + req.route.path );
});

/* Request-Name : /public/signUpUser, Type: Post, Allowed : public*/
router.post( '/public/signUpUser', function( req, res, next ) {
	console.log( 'In loginRoutes, Handling ' + req.route.path );

	loginController.signUpUser( req, res, next );

	console.log( 'In loginRoutes | Completed Processinf for ' + req.route.path );
});
