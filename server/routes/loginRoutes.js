var loginController = require( '../controllers/loginController' );

/* GET /cities listing. */
/* Request-Name : /public/login, Type : Post, Allowed : public*/
/* This Rest Request is responsible for logging in a user.
 * Request body must have an email and credential field.
 */
router.post( '/public/login',
		function(req, res, next) {

			console.log( 'In loginRoutes | Handling ' + req.route.path );

			loginController.loginUser( req, res, next );

			console.log( 'In loginRoutes | Complted Processing for '
					+ req.route.path );
		} );

/* Request-Name : /public/email, Type : Post, Allowed : public*/
/* This Rest Request is supposed to check if an email already exists in the system.
 * Request body must contain an email field.
 */
router.post( '/public/email', function( req, res, next) {

	console.log( 'In loginRoutes | Handling ' + req.route.path );

	loginController.isUserAlreadyInSystem( req, res, next );

	console.log( 'In loginRoutes | Completed Processing for ' + req.route.path );
});

/* Request-Name : /public/users, Type: Post, Allowed : public*/
/* This Rest Requset is supposed to add a new user in the system.
 */
router.post( '/public/users', function( req, res, next ) {
	console.log( 'In loginRoutes | Handling ' + req.route.path );

	loginController.signUpUser( req, res, next );

	console.log( 'In loginRoutes | Completed Processing for ' + req.route.path );
});

/* Request-Name : /user/logout, Type: Post, Allowed : user, admin*/
/* This request is supposed to put the retrieved token into blacklist.
 */
router.post( '/user/logout', function( req, res, next ){
    console.log( 'In loginRoutes | Handling ' + req.route.path ) ;

    loginController.logoutUser( req, res, next );

    console.log( 'In loginRoutes | Completed Processing for ' + req.route.path);
});