var credentials = require( './../credentials' );
console.log( credentials );

var mongoose = require( 'mongoose' );

var citiesConnection = mongoose.createConnection( credentials.connectionString.cities);

var citiesSchema = new mongoose.Schema( {
	city : String,
	partialConnectionString : String
} );

var CitiesModal = citiesConnection.model( 'cities', citiesSchema );

citiesConnection.on('open', function (){
	console.log('Connection has been opened to cites');

	CitiesModal.find( {}, function ( err, availableCities ) {
		console.log('Total Available Cities count ' + availableCities.length );

		if ( availableCities.length == 0 ){
			throw new Error("No cites in the DB");
		} else {
			availableCities.forEach( function ( city ) {
				console.log( city );

				var connectionStringForCity = credentials.connectionString[city.city];

				if ( typeof connectionStringForCity === 'undefined' ) {
					//We don't have entry for it in credentials.js
					throw new Error("Credentials Not found for " + city.city + " city in credentials.js");
				} else {
					var connectionName = '"' + city.city + 'Connection' + '"';

					global[connectionName] = mongoose.createConnection( 'mongodb://' + credentials.mongo.user + ':' + credentials.mongo.pass + city.partialConnectionString);

					global[connectionName].on('open', function() {
						console.log('Connection to ' + global[connectionName] + ' has been opened');
						console.log(global);
					});
				}

			} );
		}
	});
});
