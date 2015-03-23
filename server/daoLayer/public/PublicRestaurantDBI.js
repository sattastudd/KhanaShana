/* This is DBI file for public Restaurant Info Interaction*/
var appConstants = require( '../../constants/ServerConstants' );

var restaurantModelModule = require( '../../models/restaurant/restaurants' );

var getRestaurrantInfoBySlug = function (cityName, slug, callback){

    console.log( 'In PublicRestaurantDBI | Starting Execution of getRestaurantInfoBySlug' );

    var cityDBConnection = utils.getDBConnection( cityName );

    restaurantModelModule.setUpConnection( cityDBConnection );
    var RestaurantModel = restaurantModelModule.getRestaurantModel();

    var query = {
        slug : slug
    };

    var projection = {
        _id : false
    };

    RestaurantModel.find( query, projection, function( err, result ) {

        if( err ) {
            callback( err );
        } else {
            callback( null, result );
        }

    });

    console.log( 'In PublicRestaurantDBI | Finished Execution of getRestaurantInfoBySlug' );

};

exports.getRestaurrantInfoBySlug = getRestaurrantInfoBySlug;
