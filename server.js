
/**
 * Module dependencies.
 */

var express = require('express')
  , bodyParser = require('body-parser')
  , methodOverride = require('method-override')
  , errorHandler = require('errorhandler')
  , moment = require('moment')
  , mongoose = require('mongoose')
  , credentials = require('./credentials');

console.log(credentials);

var app = module.exports = express();

router = express.Router();
var restaurants = require('./server/routes/restaurants');
var cities = require('./server/routes/cities');
var locations = require('./server/routes/locations');

// Configuration
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(methodOverride());

if ('development' == app.get('env')) {
  app.use(errorHandler({ dumpExceptions: true, showStack: true }));
}

if ('production' == app.get('env')) {
  app.use(errorHandler());
}

// Routes
app.use(function (req, res, next) {
  console.log('%s user from %s at Time: %s',req.headers['x-forwarded-for'] || req.connection.remoteAddress ,req.headers['user-agent'] ,moment(Date.now()).format());
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

app.use('/', router);

app.set('port', process.env.PORT || 3000);

console.log('trying to connect to DB');

/*These two objects would be available in global scope*/
global.lucknowConnection = mongoose.createConnection( credentials.connectionString.lucknow );
global.delhiConection = mongoose.createConnection( credentials.connectionString.delhi );

global.getConnectionByCity = function( cityName ) {

  console.log('I got ' + cityName);

  console.log( cityName === 'lucknow' );
  console.log( cityName == 'lucknow' );
	if ( cityName === 'lucknow' ) { console.log('Returing lucknow' ); return global.lucknowConnection; }
	else if ( cityName === 'delhi' ) { console.log('Returning Delhi' ); return global.delhiConnection; }
};

console.log(global.getConnectionByCity( 'lucknow' ));

mongoose.connect('mongodb://karim:Karim@ds033831.mongolab.com:33831/lucknow', function(err) {
    if(err) console.log(err);
    console.log('DB connection successful');
    app.listen(app.get('port'), function() {
  		console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
	});
});
