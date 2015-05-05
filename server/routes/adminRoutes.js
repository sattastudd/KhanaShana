var statsController = require( '../controllers/admin/stats/StatsController' );
var optionsController = require( '../controllers/admin/options/OptionsController' );
var adminRestController = require( '../controllers/admin/restaurant/AdminRestaurantController' );
var usersController = require( '../controllers/admin/users/UsersController' );

/* Request-Name : /admin/stats, Type : Get, Allowed : admin*/
/* This request would be used by admin to get application stats. */

router.get( '/admin/stats', function( req, res, next ){
    console.log( 'In adminRoutes | Handling ' + req.route.path );

    statsController.getStats( req, res, next);

    console.log( 'In adminRoutes | Finished ' + req.route.path );
});

/* Request-Name : /admin/options, Type : Get, Allowed : admin*/
/* This request would be used by admin to get application options. */

router.get( '/admin/options', function( req, res, next ){
	console.log( 'In adminRoutes | Handling ' + req.route.path );

    optionsController.getRestaurantOptions( req, res, next );

	console.log( 'In adminRoutes | Finished ' + req.route.path );
});

/* Request-Name : /admin/users, Type: Post, Allowed : admin*/
/* This request would be used by admin to get and search users in the system.*/
router.post( '/admin/users', function( req, res, next ) {
    console.log( 'In adminRoutes | Handling ' + req.route.path );

    usersController.getUserList( req, res, next );

    console.log( 'In adminRoutes | Finished ' + req.route.path );
});

/* Request-Name : /admin/user, Type: Post, Allowed : admin*/
/* This request would be used by admin to create a new user.*/
router.post( '/admin/user', function( req, res, next ) {
    console.log( 'In adminRoutes | Handling ' + req.route.path );

    usersController.createOrEditUser( req, res, next );

    console.log( 'In adminRoutes | Finished ' + req.route.path );
});

/* Request-Name : /admin/user/reset, Type: Post, Allowed : admin*/
/* This request would be used by admin to reset password of a user.*/
router.post( '/admin/user/reset', function( req, res, next ) {
    console.log( 'In adminRoutes | Handling ' + req.route.path );

    usersController.resetUserPassword( req, res, next );

    console.log( 'In adminRoutes | Finished' + req.route.path );
});

/* Request-Name : /admin/user/blacklist, Type: Post, Allowed : admin*/
/* This request would be used by admin to blacklist a user. */
router.post( '/admin/user/blacklist', function( req, res, next ) {
    console.log( 'In adminRoutes | Handling ' + req.route.path );

    usersController.blackListUser( req, res, next );

    console.log( 'In adminRoutes | Finished' + req.route.path );
});


/* Restaurant Related Routes */
/*==========================================================*/
/* Request-Name : /admin/restaurants/approved, Type: Post, Allowed : admin*/
/* This request would be used by admin to search and list all restaurants. */
router.post( '/admin/restaurants/approved', function( req, res, next ) {
    console.log( 'In adminRoutes | Handling ' + req.route.path );

    adminRestController.getApprovedRestaurantList( req, res, next );

    console.log( 'In adminRoutes | Finished' + req.route.path );
});

/* Request-Name : /admin/restaurants/unapproved, Type : Post, Allowed : admin*/
/* This request would be used by admin to search and list all unapproved restaurants*/
router.post( '/admin/restaurants/unapproved', function( req, res, next ) {
    console.log( 'In adminRoutes | Handling ' + req.route.path );

    adminRestController.getUnapprovedRestaurantList( req, res, next );

    console.log( 'In adminRoutes | Finished' + req.route.path );
});

/* Request-Name : /admin/restaurants, Type: Post, Allowed : admin*/
/* This request would be used by admin to create new Restaurant */
router.post('/admin/restaurants', function( req, res, next ) {
    console.log( 'In adminRoutes | Handling ' + req.route.path );

    adminRestController.createOrEditRestaurant(req, res, next );

    console.log( 'In adminRoutes | Finished ' + req.route.path );
});