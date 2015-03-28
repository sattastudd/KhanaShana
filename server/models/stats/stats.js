/*Models are used as DTO. They control the data we will send in and retrieve from DB.
 */
var mongoose = require( 'mongoose' );

var statsSchema = new mongoose.Schema({
    users_count : Number,
    restaurant_count : Number,
    reviews_count : Number,
    orders_count : Number
});

var connection = null;
var model = null;

var setUpConnection = function( connectionToBeUsed ){
    connection = connectionToBeUsed;

    model = connection.model( 'appStats', statsSchema, 'appStats' );
};

var getModel = function (){
    if( connection!= null && model != null ){
        return model;
    } else {
        throw new Error("Connection has not been set up yet.");
    }
};

exports.setUpConnection = setUpConnection;
exports.getModel = getModel;