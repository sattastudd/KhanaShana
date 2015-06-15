var statsController = require( '../controllers/admin/stats/StatsController' );
var optionsController = require( '../controllers/admin/options/OptionsController' );
var adminRestController = require( '../controllers/admin/restaurant/AdminRestaurantController' );
var usersController = require( '../controllers/admin/users/UsersController' );
var cuisineController = require( '../controllers/admin/cuisines/AdminCuisineController' );
var locationController = require( '../controllers/admin/locations/AdminLocationController' );

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

/* Request-Name : /admin/restaurants, Type: Post, Allowed : admin*/
/* This request would be used by admin to create new Restaurant */
router.post('/admin/restaurants', function( req, res, next ) {
    console.log( 'In adminRoutes | Handling ' + req.route.path );

    adminRestController.addNewRestaurant(req, res, next );

    console.log( 'In adminRoutes | Finished ' + req.route.path );
});

/* Request-Name : /admin/restaurants/search, Type: Post, Allowed : admin*/
/* This request would be used by admin to create new Restaurant */
router.post('/admin/restaurants/search', function( req, res, next ) {
    console.log( 'In adminRoutes | Handling ' + req.route.path );

    adminRestController.searchRestaurants(req, res, next );

    console.log( 'In adminRoutes | Finished ' + req.route.path );
});

/* Request-Name : /admin/restaurant/:restSlug, Type : Get, Allowed : admin*/
/* This request would be used by admin to retrieve all data of restaurant.*/
router.get( '/admin/restaurant/:restSlug', function( req, res, next ) {
    console.log( 'In adminRoutes | Handling ' + req.route.path );

    req.body.slug = req.params.restSlug;
    adminRestController.readRestaurantSpecificData(req, res, next );

    console.log( 'In adminRoutes | Finished ' + req.route.path );
});

/* Request-Name : /admin/restaurant/:restSlug, Type : Put, Allowed : admin*/
/* This request would be used by admin to update existing restaurant details. */
router.put( '/admin/restaurant/:restSlug', function( req, res, next ) {

    console.log( 'In adminRoutes | Handling ' + req.route.path );
    
    adminRestController.updateRestaurantDetails(req, res, next );

    console.log( 'In adminRoutes | Finished ' + req.route.path );

});

/* Request-Name : /public/restaurants/image, Type : Put, Allowed : public */
/* This request would be used by admin to update existing restaurant details. */
router.get( '/public/restaurants/image', function( req, res, next ) {
    console.log( 'In adminRoutes | Handling ' + req.route.path );

    adminRestController.getRestaurantBannerImagePath(req, res, next );

    console.log( 'In adminRoutes | Finished ' + req.route.path );
});

/* Request-Name : /admin/restaurants/approve, Type : Post, Allowed : admin*/
/* THis request would be admin to approve a restaurant. */
router.post( '/admin/restaurants/approve', function( req, res, next ) {
    console.log( 'In adminRoutes | Handling ' + req.route.path );

    adminRestController.approveRestaurant(req, res, next );

    console.log( 'In adminRoutes | Finished ' + req.route.path );
});

/*                          Admin Cuisine Routes                        */
/*======================================================================*/

/* Request-Name : /admin/cuisine/search, Type : Post, Allowed : admin*/
/* This request would be used by admin to search cuisines. */
router.post( '/admin/cuisine/search', function( req, res, next ) {
    console.log( 'In adminRoutes | Handling ' + req.route.path );

    cuisineController.getCuisines(req, res, next );

    console.log( 'In adminRoutes | Finished ' + req.route.path );
});


/*                          Admin Location Routes                        */
/*======================================================================*/
/* Request-Name : /admin/locations/search, Type : Post, Allowed : admin*/
/* This request would be used by admin to search cuisines. */
router.post( '/admin/locations/search', function( req, res, next ){
    console.log( 'In adminRoutes | Handling ' + req.route.path );

    locationController.getAllLocations(req, res, next );

    console.log( 'In adminRoutes | Finished ' + req.route.path );
});