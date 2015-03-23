/* This is DBI file for public Restaurant Info Interaction*/
var ServerConstants = require( '../../constants/ServerConstants' );
var restaurantModelModule = require( '../../models/restaurant/restaurants' );

/*                                  Publlic Methods                                 */
/*==================================================================================*/

/* This method is responsible for retrieving restaurant data by using the slug field
 * Slug field represents alternate unique id to be used instead of id.
 */
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

    RestaurantModel.findOne( query, projection, function( err, result ) {

        if( err ) {
            callback( err );
        } else {
            if( null === result ) {
                callback( ServerConstants.appErrors.noRecordFound );
            } else {
                callback( null, result );
            }
        }

    });

    console.log( 'In PublicRestaurantDBI | Finished Execution of getRestaurantInfoBySlug' );

};

exports.getRestaurrantInfoBySlug = getRestaurrantInfoBySlug;
