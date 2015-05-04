/*Models are used as DTO. They control the data we will send in and retrieve from DB.
 */
var mongoose = require( 'mongoose' );

var commentSchema  = new mongoose.Schema({
	restaurant : String,
	user : {
		name : String,
		email : String,
	},
	comment : String,
	date_insert : Date,
	approved : Boolean,
	rating : Number
});

var connection = null;
var model = null;

var setUpConnection = function( connectionToBeUsed ) {
    connection = connectionToBeUsed;

    model = connection.model('Comments', commentSchema, 'Comments' );
};

var getModel = function(){
    if( connection!= null && model != null ){
        return model;
    } else {
        throw new Error("Connection has not been set up yet.");
    }
};

exports.setUpConnection = setUpConnection;
exports.getModel = getModel;