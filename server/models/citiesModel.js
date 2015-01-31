//Models are used for data storage. 
//It is where we will retrieve data from DB.
//In other words, DAOImpl.

var mongoose = require( 'mongoose' );

var citiesSchema = new mongoose.Schema({
	city : String,
	partialConnectionString: String
});

var connection = null;
var CitiesModal = null;

var setUpConnection = function( connectionToBeUsed ) {
	connection = connectionToBeUsed;

	CitiesModal = connectionToBeUsed.model( 'cities');
};

var getModel = function() {
	if( connection != null && CitiesModal != null){
		return CitiesModal;
	} else {
		throw new Error( 'Connection has not been set yet.' );
	}
}

exports.setUpConnection = setUpConnection;
exports.getModel = getModel;