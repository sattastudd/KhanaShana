var request = require("request");
var BlueDart = require('../dataTraveller/BlueDart');
var citiesModelModule = require( '../models/citiesModel' );

/* Cities Controller */

var getCityList = function(req, res, next){
	console.log( 'In citiesController | Entering getCityList method ');

	var citiesConnection = utils.getDBConnection('all');

	citiesModelModule.setUpConnection( citiesConnection );
	var CitiesModal = citiesModelModule.getModel();

	CitiesModal.find( function (err, availableCities) {
		var blueDart = new BlueDart();

		if( err ) {
			blueDart.setData( 'An error has ocurred' );
			blueDart.setMessage( err );
			blueDart.setStatus( 500 );

			res.send( blueDart );
		} else {
			var cityArray = [];

			availableCities.forEach( function( city ) {
				cityArray.push( city.city );
			});

			blueDart.setData( cityArray );
			blueDart.setMessage( 'OK' );
			blueDart.setStatus( 200 );

			res.send( blueDart );
		}
	});

	console.log( 'In citiesController | Finnishing getCityList method ');
};

/*Exporting*/
exports.getCityList = getCityList;