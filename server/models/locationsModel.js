//Models are used for data storage. 
//It is where we will retrieve data from DB.
//In other words, DAOImpl.
var mongoose = require('mongoose');

var locationsSchema = new mongoose.Schema({
  	name: String
});

var connection = null;
var LocationModel = null;

var setUpConnection = function ( connectionToBeUsed ) {
	connection = connectionToBeUsed;

	LocationModel = connectionToBeUsed.model( 'locations', locationsSchema );
};

var getLocationModel = function () {
	if ( connection != null && LocationModel != null) {
		return LocationModel;
	} else {
		throw new Error ( 'Connection has not been set yet.' );
	}
}

exports.setUpConnection = setUpConnection;
exports.getLocationModel = getLocationModel;