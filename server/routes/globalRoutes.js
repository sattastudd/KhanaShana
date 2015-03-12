var globalDataController = require( '../controllers/globalDataController' );

/* GET /cities listing. */
/* Request-Name : /public/globalData, Type : Post, Allowed : public*/
router.post( '/public/globalData',
		function(req, res, next) {

			console.log( 'In globalRoutes | Handling ' + req.route.path );

			globalDataController.getGlobalData( req, res, next );

			console.log( 'In globalRoutes | Complted Processing for '
					+ req.route.path );
		} );