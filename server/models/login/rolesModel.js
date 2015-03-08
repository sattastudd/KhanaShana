/* Model are used for data storage.
 * It is where we will retrive data.
 * It other words, it simple describes an schema of the collection.
 */

var mongoose = require( 'mongoose' );
var rolesSchema = new mongoose.Schema({
	name : String
});

var connection = null;
var model = null;

var setUpConnection = function( connectionToBeUsed ) {
	connection = connectionToBeUsed;

	model = connection.model( 'roles', rolesSchema, 'roles');
};

var getRolesModel = function() {
	
	if( connection != null && model !== null ) {
		return model;
	} else {
		throw new Error( 'Connection has not been set up yet.' );
	}
};

var getObjectIdObject = function() {
	return mongoose.Types.ObjectId;
};

exports.setUpConnection = setUpConnection;
exports.getRolesModel = getRolesModel;
exports.getObjectIdObject = getObjectIdObject;
