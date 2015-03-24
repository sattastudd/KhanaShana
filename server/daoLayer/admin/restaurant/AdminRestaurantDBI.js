/* This is DB Interaction file for Admin Restaurant related tasks. */
var RestaurantModelModule = require( '../../../models/restaurant/restaurants' );

var addNewRestaurant = function( cityName, restaurantToInsert, callback ) {

    console.log( 'In RestaurantModelModule | Starting Execution of addNewRestaurant' );

    var cityDBConnection = utils.getDBConnection( cityName );

    RestaurantModelModule.setUpConnection( cityDBConnection );
    var RestaurantModel = RestaurantModelModule.getRestaurantModel();

    var Restaurant = new RestaurantModel({
        name : restaurantToInsert.name,
        address : restaurantToInsert.address,
        delivery : restaurantToInsert.delivery,
        cuisines : restaurantToInsert.cuisines,
        cost : restaurantToInsert.cost,
        detail : restaurantToInsert.detail,
        menu : restaurantToInsert.menu,
        slug : restaurantToInsert.slug
    });

    Restaurant.save( function ( err, result ) {
        if( err ) {
            callback ( err );
        } else {
            callback( null, result );
        }
    });
    console.log( 'In RestaurantModelModule | Finished Execution of addNewRestaurant' );
};

exports.addNewRestaurant = addNewRestaurant;