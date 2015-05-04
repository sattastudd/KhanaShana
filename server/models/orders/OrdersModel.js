/*Models are used as DTO. They control the data we will send in and retrieve from DB.
 */
var mongoose = require( 'mongoose' );

var priceSchema = new mongoose.Schema({
    title : String,
    quantity : Number
    price : Number,
    total : Number
});


var ordersSchema  = new mongoose.Schema({
	restaurant : String,
	user : {
		name : String,
		email : String,
	},
	items : [ priceSchema ],
	total : Number,
	order_date : Date,
	address : String,
	discount : Number,
	net : Number,
	feedback : String,
	rating : Number
});

var connection = null;
var model = null;

var setUpConnection = function( connectionToBeUsed ) {
    connection = connectionToBeUsed;

    model = connection.model('Orders', commentSchema, 'Orders' );
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