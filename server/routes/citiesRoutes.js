var citiesController = require( '../controllers/citiesController' );

/* GET /cities listing. */
/* Request-Name : /cities, Type : Get, Allowed : public */
router.get( '/cities',
		function(req, res, next) {

			console.log( 'In citiesRoutes | Handling ' + req.route.path );

			citiesController.getCityList( req, res, next );

			console.log( 'In citiesRoutes | Complted Processing for '
					+ req.route.path );
		} );