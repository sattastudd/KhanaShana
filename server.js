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
var mongoose 		= 	require( 'mongoose' );

/* Internal Modules */
var credentials 	= 	require( './credentials' );
var dbConfig 		= 	require( './config/DbConfigure' );

/* Authentication and Authorization Modules */
var Authenticator 	= 	require( './server/middleWares/Authenticator' );
var BlackListFilter 	= 	require( './server/middleWares/BlackListFilter' );
var AuthorizationFilter =	require( './server/middleWares/AuthorizationFilter' );

/* Retrieving Request Mapper Module */
var requestMapper = require( './config/RequestMapper' );

var jwt 		= 	require( 'jsonwebtoken' );

/* Setting up DataBase Connections using Configure */
dbConfig.configure();

var app = module.exports = express();

/* Create Synchronized request authorization map */
requestMapper.createRequestMap();

/* MiddleWare to log all Requests, No matter what is their fate.*/
app.use( function( req, res, next ) {
	console.log( '%s user from %s at %s', 
			req.headers['x-forwarded-for'] || req.connection.remoteAddress,
			req.headers['user-agent'],
			moment( Date.now() ).format() );
	
	res.header( 'Acess-Control-Allow-Origin', '*' );
	next();
} );

app.set( 'port', 3000 );

/* Here is another global variable that really should not be here.*/
router  = express.Router();

var restaurants = require( './server/routes/restaurants' );
var cities = require( './server/routes/citiesRoutes' );
var locations = require( './server/routes/locationsRoutes' );
var globalDataRoute = require( './server/routes/globalRoutes' );

/* Setting up modules to work on /admin and /user requests only. */
app.use( ['/admin', '/user'], Authenticator, BlackListFilter, AuthorizationFilter);


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
	
	console.log( 'DB Connections established to all DBs' );
	console.log( 'Starting Server' );

	app.listen( app.get( 'port'), function(){
		console.log( 'Experss Server listening on port %d in %s mode', this.address().port, app.settings.env );
	});
});
