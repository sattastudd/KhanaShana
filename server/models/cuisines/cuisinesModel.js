//Models are used for data storage. 
//It is where we will retrieve data from DB.
//In other words, DAOImpl.
var mongoose = require( 'mongoose' );

var cuisinesSchema = new mongoose.Schema( {
	name : String,
	img : String,
    isOnHomePage : Boolean,
    slug : String
} );

var connection = null;
var model = null;

var setUpConnection = function(connectionToBeUsed) {

	connection = connectionToBeUsed;

	model = connectionToBeUsed.model( 'Cuisines', cuisinesSchema, 'Cuisines' );
};

var getModel = function() {

	if ( connection !== null && model !== null ) {
		return model;
	} else {
		throw new Error( 'Connection has not been set up yet.' );
	}
};

exports.setUpConnection = setUpConnection;
exports.getModel = getModel;