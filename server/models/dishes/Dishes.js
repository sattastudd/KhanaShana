//Models are used for data storage. 
//It is where we will retrieve data from DB.
//In other words, DAOImpl.
var mongoose = require( 'mongoose' );

var dishSchema = new mongoose.Schema( {
    title : String,
    active : Boolean
});

var connection = null;
var DishModel = null;

var setUpConnection = function(connectionToBeUsed) {

    connection = connectionToBeUsed;

    DishModel = connectionToBeUsed.model( 'Dishes', dishSchema, 'Dishes' );
};

var getModel = function() {

    if ( connection !== null && DishModel !== null ) {
        return DishModel;
    } else {
        throw new Error( 'Connection has not been set up yet.' );
    }
};

exports.setUpConnection = setUpConnection;
exports.getModel = getModel;