var globalDataController = require( '../controllers/globalDataController' );

/* GET /cities listing. */
/* Request-Name : /getGlobalData, Type : Post, Allowed : public, admin */
router.post( '/getGlobalData',
		function(req, res, next) {

			console.log( 'In citiesRoutes | Handling ' + req.route.path );

			globalDataController.getGlobalData( req, res, next );

			console.log( 'In citiesRoutes | Complted Processing for '
					+ req.route.path );
		} );