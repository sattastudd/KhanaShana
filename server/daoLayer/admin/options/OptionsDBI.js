/* This Database Interaction file would read Restaurants And Cuisines from other DBIs'
 */

var async = require( 'async' );

var CuisineDBI = require( '../cuisine/AdminCuisineDBI' );
var LocationDBI = require( '../location/AdminLocationDBI' );

/* Public Method to retrieve cuisines and locations from other DBIs. */
var getRestaurantOptions = function  ( callback ) {
    console.log( 'In OptionsDBI | Starting Execution of getRestaurantOptions' );

    var cityName = 'lucknow';

    async.parallel({
            cuisines: async.apply(CuisineDBI.getAllCuisines, cityName),
            locations: async.apply(LocationDBI.getAllLocations, cityName)
        },
        function( err, results ){
            if( err ){
                callback( err );
            } else {
                callback( null, results );
            }
        }
    );


    console.log( 'In OptionsDBI | Finished Execution of getRestaurantOptions' );
};

exports.getRestaurantOptions = getRestaurantOptions;
