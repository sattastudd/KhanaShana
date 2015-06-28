/* We need to import GlobalUtil Module first.
 * It is necessary to define and declare global objects using its configure method.
 * So that, the global objects can be used in other modules as well.
 */

var GlobalUtil = require( './config/GlobalUtil' );
GlobalUtil.configure();

/* External Modules */
var express		= 	require( 'express' );
var bodyParser 		= 	require( 'body-parser' );
var methodOverRide 	= 	require( 'method-override' );
var errorHandler 	= 	require( 'errorhandler' );
var moment 		= 	require( 'moment' );

/* Internal Modules */
var dbConfig 		= 	require( './config/DbConfigure' );

/* Authentication and Authorization Modules */
var Authenticator 	= 	require( './server/middleWares/Authenticator' );
var BlackListFilter 	= 	require( './server/middleWares/BlackListFilter' );
var AuthorizationFilter =	require( './server/middleWares/AuthorizationFilter' );

/* Retrieving Request Mapper Module */
var requestMapper = require( './config/RequestMapper' );

/* Setting up DataBase Connections using Configure */
dbConfig.configure();

var app = module.exports = express();

/* Create Synchronized request authorization map */
requestMapper.createRequestMap();

/* MiddleWare to log all Requests, No matter what is their fate.*/
app.use( function( req, res, next ) {
    var msg = ( req.headers['x-forwarded-for'] || req.connection.remoteAddress ) + ' user from ' +
        req.headers['user-agent'] +
        ' at ' +
        moment( Date.now() ) ;

    logger.access( msg );
	
	res.header( 'Acess-Control-Allow-Origin', '*' );
	next();
} );

app.set( 'port', 3000 );

/* Here is another global variable that really should not be here.*/
router  = express.Router();

var globalDataRoute = require( './server/routes/globalRoutes' );
var loginRoute = require( './server/routes/loginRoutes' );
var publicRestaurantRoute = require( './server/routes/restaurantRoute');
var adminRoutes = require( './server/routes/adminRoutes' );
var customerRoutes = require( './server/routes/customerRoutes' );
var restOwnRoutes = require( './server/routes/restaurantOwnerRoute' );

/* Setting up modules to work on /admin and /user requests only. */
app.use( ['/admin', '/user', '/restOwn'], Authenticator, BlackListFilter, AuthorizationFilter);


/* App Configuration */
app.use( bodyParser.json() );
app.use( bodyParser.urlencoded( {
	extended : true
} ) );
app.use( methodOverRide() );

if( 'development' === app.get( 'env' ) ) {
	app.use( errorHandler( {
		dumpExceptions : true,
		showStack : true
	} ) );
}

if( 'production' === app.get( 'env' ) ) {
	app.use( errorHandler() );
}

/* Adding routes to the app. */
app.use( '/', router );

var eventHandler = utils.getGlobalEventHandler();

eventHandler.on( 'PleaseStartServerNow', function() {
	
	logger.info( 'DB Connections established to all DBs' );
	logger.info( 'Starting Server' );

	app.listen( app.get( 'port'), function(){
        var msgString = 'Express Server listening on port ' + this.address().port + ' in ' + app.settings.env + '  mode.';
		logger.info( msgString );
	});
});
