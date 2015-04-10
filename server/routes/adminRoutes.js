var statsController = require( '../controllers/admin/stats/StatsController' );
var optionsController = require( '../controllers/admin/options/OptionsController' );

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