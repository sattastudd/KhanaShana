//Models are used for data storage. 
//It is where we will retrieve data from DB.
//In other words, DAOImpl.
var mongoose = require( 'mongoose' );

var usersSchema = new mongoose.Schema({
	name : String,
	email : String,
	credential : String,
	contact : String,
	role : String,
    profile_created_date : String,
    orders : Number,
    revenueGenerated : Number
});

var connection = null;
var model = null;

var setUpConnection = function(connectionToBeUsed) {

	connection = connectionToBeUsed;

	model = connectionToBeUsed.model( 'users',
			usersSchema, 'users' );
};

var getUsersModel = function() {

	if ( connection !== null && model !== null ) {
		return model;
	} else {
		throw new Error( 'Connection has not been set up yet.' );
	}
};

exports.setUpConnection = setUpConnection;
exports.getUsersModel = getUsersModel;