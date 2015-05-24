/* This is DBI file for public Restaurant Info Interaction*/
var ServerConstants = require( '../../constants/ServerConstants' );
var restaurantModelModule = require( '../../models/restaurant/restaurants' );

var async = require( 'async' );

var DBUtils = require( '../util/DBIUtil' );

/*                                  Publlic Methods                                 */
/*==================================================================================*/

/* This method is responsible for retrieving restaurant data by using the slug field
 * Slug field represents alternate unique id to be used instead of id.
 */
var getRestaurrantInfoBySlug = function (cityName, slug, callback){

    logger.info( 'In PublicRestaurantDBI | Starting Execution of getRestaurantInfoBySlug' );

    var cityDBConnection = utils.getDBConnection( cityName );

    restaurantModelModule.setUpConnection( cityDBConnection );
    var RestaurantModel = restaurantModelModule.getModel();

    var query = {
        slug : slug
    };

    var projection = {
        _id : false,
        approved : false,
        stage : false,
        owner : false,
        '__v' : false,
        allStagesCompleted : false
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

    logger.info( 'In PublicRestaurantDBI | Finished Execution of getRestaurantInfoBySlug' );

};

/*                  Restaurant Search Section               */
/*==========================================================*/

/* Private Methods */
/*=================*/

/* Private method to get restaurant count according to query specified. */
var getQueriedRestaurantCount = function( cityName, query, callback ) {
    logger.info( 'In PublicRestaurantDBI | Starting Execution of getQueriedRestaurantCount' );

    var cityDBConnection = utils.getDBConnection( cityName );

    restaurantModelModule.setUpConnection( cityDBConnection );
    var RestaurantModel = restaurantModelModule.getModel();

    RestaurantModel.count( query, function( err, count ) {
       if( err ) {
           callback( err );
       } else {
           callback( null, count );
       }
    });

    logger.info( 'In PublicRestaurantDBI | Finished Execution of getQueriedRestaurantCount' );
};

/* Private method to get queried restaurant data according to query.
 * This method would only be executed in case of first execution or fresh query.
 */
var getQueriedRestaurantData = function( cityName, query, projection, pagingParams, callback ) {
    logger.info( 'In PublicRestaurantDBI | Starting Execution of getQueriedRestaurantData' );

    var cityDBConnection = utils.getDBConnection( cityName );

    restaurantModelModule.setUpConnection( cityDBConnection );
    var RestaurantModel = restaurantModelModule.getModel();

    var options = {};

    if( pagingParams.startIndex != null ){
        options.skip = pagingParams.startIndex;
        options.limit = 10;
    }

    RestaurantModel.find( query, projection, options, function( err, result ) {
       if( err ) {
           callback( err );
       } else {
           callback( null, result );
       }
    });

    logger.info( 'In PublicRestaurantDBI | Finished Execution of getQueriedRestaurantData' );
};

/*  Public Method */

/* Public Method to search for a restaurant.
 * This method would be used for searching, not for fetching auto-complete options.
 */
var searchRestaurants = function( cityName, searchParam, pagingParams, callback ) {
    logger.info( 'In PublicRestaurantDBI | Starting Execution of searchRestaurants' );

    var query = {};

    var isLocationNotEmpty = !DBUtils.isFieldEmpty( searchParam.location ) ;

    if( isLocationNotEmpty ) {
        query.delivery = DBUtils.createCaseInSensitiveRegexString( searchParam.location );
    }

    var projection = {
        _id : false,
        approved : false,
        stage : false,
        owner : false,
        '__v' : false,
        allStagesCompleted : false
    };

    console.log( query );

    if(pagingParams.startIndex === 0 || null == pagingParams.startIndex || typeof pagingParams.startIndex === 'undefined' ) {
        async.parallel( {
            count : async.apply( getQueriedRestaurantCount, cityName, query ),
            result : async.apply( getQueriedRestaurantData, cityName, query, projection, pagingParams )
        },
        function( err, result ) {
            if( err ) {
                callback( err );
            } else {
                callback( null, result );
            }
        });
    } else {

        var cityDBConnection = utils.getDBConnection( cityName );

        restaurantModelModule.setUpConnection( cityDBConnection );
        var RestaurantModel = restaurantModelModule.getModel();

        var options = {
            skip : ( pagingParams.startIndex - 1),
            limit : 10
        };

        RestaurantModel.find( query, projection, options, function( err, result ){
            if( err ){
                callback( err );
            } else {
                callback( null, { result : result });
            }
        });
    }

    logger.info( 'In PublicRestaurantDBI | Finished Execution of searchRestaurants' );
};


exports.getRestaurrantInfoBySlug = getRestaurrantInfoBySlug;
exports.searchRestaurants = searchRestaurants;