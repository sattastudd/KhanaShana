/*Models are used as DTO. They control the data we will send in and retrieve from DB.
 */
var mongoose = require( 'mongoose' );

var priceSchema = new mongoose.Schema({
    _id : false,
    title : String,
    quantity : Number,
    price : Number,
    total : Number,
    type : String
});


var ordersSchema  = new mongoose.Schema({
	restaurant : {
        name : String,
        slug : String
    },
	user : {
		email : String
	},
    status : String,
	items : [ priceSchema ],
	total : Number,
	pending_state_date : Date,
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

    model = connection.model('Orders', ordersSchema, 'Orders' );
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