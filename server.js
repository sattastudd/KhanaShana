/**
 * Module dependencies.
 */

/* Module needs to be included first to configure global objects in the app. */
var globalVariables = require( './config/globalVariables' );
globalVariables.configure();

var express = require( 'express' ), bodyParser = require( 'body-parser' ), methodOverride = require( 'method-override' ), errorHandler = require( 'errorhandler' ), moment = require( 'moment' ), mongoose = require( 'mongoose' ), credentials = require( './credentials' ), dbConfig = require( './config/dbConfig' );

dbConfig.configure();

var app = module.exports = express();

router = express.Router();
var restaurants = require( './server/routes/restaurants' );
var cities = require( './server/routes/citiesRoutes' );
var locations = require( './server/routes/locationsRoutes' );
var globalDataRoute = require( './server/routes/globalRoutes' );

/* Retrieving Request Mapper Module */
var requestMapper = require( './config/RequestMapper' );

/* Create Syncronized request authorization map */
requestMapper.createRequestMap();

// Configuration
app.use( bodyParser.json() );
app.use( bodyParser.urlencoded( {
	extended : true
} ) );
app.use( methodOverride() );

if ( 'development' === app.get( 'env' ) ) {
	app.use( errorHandler( {
		dumpExceptions : true,
		showStack : true
	} ) );
}

if ( 'production' === app.get( 'env' ) ) {
	app.use( errorHandler() );
}

// Routes
app.use( function(req, res, next) {

	console.log( '%s user from %s at Time: %s', req.headers['x-forwarded-for']
			|| req.connection.remoteAddress, req.headers['user-agent'], moment(
			Date.now() ).format() );
	res.header( 'Access-Control-Allow-Origin', '*' );
	next();
} );

app.use( '/', router );

app.set( 'port', 3000 );

eventHandler.on( 'pleaseStartServerNow', function() {

	console.log( 'DB Connection Established to all cities.' );
	console.log( 'Starting Server' );

	app.listen( app.get( 'port' ), function() {

		console.log( "Express server listening on port %d in %s mode", this
				.address().port, app.settings.env );
	} );

} );