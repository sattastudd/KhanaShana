var credentials = require( './../credentials' );
var mongoose = require( 'mongoose' );

// Retrieving global variables that would be used in here.
var eventHandler = utils.getEventHandler();

// We need a variable here, to make sure that we have opened all the connections
// for the available cities in the database.
// This variable will be updated on a event emit.
// If its value gets same as the length of the avaiable cities array,
// We will know its time to broadcast event to start our server.
var callCount = 0;

eventHandler.on( 'connectionEstablished', function(totalCount) {

	callCount++;

	if ( callCount === totalCount ) {
		eventHandler.emit( 'pleaseStartServerNow' );
	}
} );

var configure = function() {

	console.log( 'Configuring Global Database Connections ' );

	var citiesConnection = mongoose
			.createConnection( credentials.connectionString.global_data );

	var citiesSchema = new mongoose.Schema( {
		city : String,
		partialConnectionString : String
	} );

	var CitiesModal = citiesConnection.model( 'cities', citiesSchema );

	citiesConnection.on( 'open', function() {

		console.log( 'Connection to cities has been opened' );

		CitiesModal.find( function(err, availableCities) {

			console.log( 'Total Available Cities ' + availableCities.length );

			if ( availableCities.length === 0 ) {
				throw new Error( 'No cities found in the Database' );
			} else {
				// Creating a array in global object for storing connection
				// references
				global.globalConnections = [];

				// Pushing cities connection to the list with key 'all'
				global.globalConnections.push( {
					cityName : 'all',
					connection : citiesConnection
				} );

				availableCities.forEach( function(city) {

					var connectionObject = {
						cityName : city.city
					};

					connectionObject.connection = mongoose
							.createConnection( 'mongodb://'
									+ credentials.mongo.user + ':'
									+ credentials.mongo.pass
									+ city.partialConnectionString );

					connectionObject.connection.on( 'open', function() {

						global.globalConnections.push( connectionObject );
						console.log( 'Connection opened for '
								+ connectionObject.cityName + ' city' );

						eventHandler.emit( 'connectionEstablished',
								availableCities.length );
					} );
				} );
			}
		} );
	} );

	console.log( 'Configuring Global Database Connections Completed' );
};

exports.configure = configure;
