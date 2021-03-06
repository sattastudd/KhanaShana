/*Models are used as DTO. They control the data we will send in and retrieve from DB.
 */
var mongoose = require( 'mongoose' );

var dishSchema = new mongoose.Schema({
    title : String,
    type : String,
    veg : Boolean,
    price : {
        half : Number,
        full : Number
    },
    _id : false
});

var restaurantSchema = new mongoose.Schema({
    name : String,

    slug : String,
    createDate : Date,

    stage : String,

    owner : {
        name : String,
        email : String
    },

    approved : Boolean,
    
    allStagesCompleted : Boolean,

    address : {
        co_ord : String,
        street : String,
        locality : String,
        town : String,
        city : String,
        postal_code : String
    },

    delivery : [String],
    cuisines : [String],

    cost : {
        avg : Number,
        min : Number,
        costForTwo : Number,
        minimumDeliveryAt : Number
    },
    detail : {
        timing : String,
        rating : Number,
        total_votes : Number,
        total_orders : Number,
        total_revenue_earned : Number,
        delivery_time : String
    },
    menu : [
        {
            '_id' : false,
            title : String,
            items : [
                dishSchema
            ]
        }
    ],
    img : {
        xs : String,
        md : String,
        sm : String,
        lg : String,
        snip : String
    }
});

var connection = null;
var model = null;

var setUpConnection = function( connectionToBeUsed ) {
    connection = connectionToBeUsed;

    model = connection.model('Restaurants', restaurantSchema, 'Restaurants' );
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