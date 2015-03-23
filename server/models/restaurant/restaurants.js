/*Models are used as DTO. They control the data we will send in and retrieve from DB.
 */
var mongoose = require( 'mongoose' );

var restaurantSchema = new mongoose.Schema({
    name : String,
    address : {
        co_ord : String,
        street : String,
        locality : String,
        town : String,
        city : String,
        postal_code : String,
    },
    delivery : [String],
    cuisines : [String],
    cost : {
        avg : Number,
        min : Number
    },
    detail : {
        timing : String,
        rating : Number,
        total_vots : Number
    },
    menu : [
        {
            title : String,
            items : [
                {
                    title : String,
                    type : String,
                    veg : Boolean,
                    price : {
                        half : Number,
                        full : Number
                    }
                }
            ]
        }
    ]
});

var connection = null;
var model = null

var setUpConnection = function( connectionToBeUsed ) {
    connection = connectionToBeUsed;

    model = connection.model('Restaurants', restaurantSchema, 'Restaurants' );
};

var getRestaurantModel = function(){
    if( connection!= null && model != null ){
        return model;
    } else {
        throw new Error("Connection has not been set up yet.");
    }
};

exports.setUpConnection = setUpConnection;
exports.getRestaurantModel = getRestaurantModel;