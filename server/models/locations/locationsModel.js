//Models are used for data storage. 
//It is where we will retrieve data from DB.
//In other words, DAOImpl.
var mongoose = require( 'mongoose' );

var locationsSchema = new mongoose.Schema( {
	name : String,
    isOnHomePage : Boolean,
    dateModified : Date
} );

var connection = null;
var LocationModel = null;

var setUpConnection = function(connectionToBeUsed) {

	connection = connectionToBeUsed;

	LocationModel = connectionToBeUsed.model( 'Locations', locationsSchema, 'Locations' );
};

var getModel = function() {

	if ( connection !== null && LocationModel !== null ) {
		return LocationModel;
	} else {
		throw new Error( 'Connection has not been set up yet.' );
	}
};

exports.setUpConnection = setUpConnection;
exports.getModel = getModel;