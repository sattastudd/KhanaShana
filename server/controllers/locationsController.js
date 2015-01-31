var BlueDart = require('../dataTraveller/BlueDart');
var locationModule = require("../models/locationsModel");
/* Cities Controller */

var getAllLocations = function( req, res, next ) {

	console.log( 'In locationsController | Entering getAllLocations method' );

	var cityConnection = utils.getDBConnection( req.params.CityName );

	locationModule.setUpConnection( cityConnection );
	LocationModel = locationModule.getLocationModel();

	var query = {};
	var projection = {
		'_id' : false
	};

	LocationModel.find( query, projection, function( err, locations ){
		var blueDart = new BlueDart();

		if(err){
			blueDart.setData( 'An error has ocurred' );
			blueDart.setMessage( err );
			blueDart.setStatus( 500 );

			res.send( blueDart );
		} else {
			blueDart.setData( locations );
			blueDart.setMessage( 'OK' ) ;
			blueDart.setStatus( 200 );

			res.send( blueDart );
		}
	})

	console.log( 'In locationsController | Finished getAllLocations method ');
}

exports.getAllLocations = getAllLocations;