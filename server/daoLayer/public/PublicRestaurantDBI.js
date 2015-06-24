/* This is DBI file for public Restaurant Info Interaction*/
var ServerConstants = require( '../../constants/ServerConstants' );
var restaurantModelModule = require( '../../models/restaurant/restaurants' );
var CuisineModelModule = require( '../../models/cuisines/cuisinesModel' );
var DishesModelModule = require( '../../models/dishes/Dishes' );

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

    var isCuisineNotEmpty = !DBUtils.isFieldEmpty( searchParam.cuisine ) ;

    if( isCuisineNotEmpty ) {
        query.cuisines = DBUtils.createCaseInSensitiveRegexString( searchParam.cuisine );
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

/*                  Section for fetching auto-complete options.                 */
/*==============================================================================*/

/*          Private Methods             */
/*======================================*/

/* This method would search restaurants according to the text provided.
 * This method is supposed to be used for type-ahead search.
 */
var findRestaurantsForAutoComplete = function( cityName, text, callback ) {
    logger.info( 'In PublicRestaurantDBI | Starting Execution of findRestaurantsForAutoComplete' );

    var cityDBConnection = utils.getDBConnection( cityName );

    restaurantModelModule.setUpConnection( cityDBConnection );
    var RestaurantModel = restaurantModelModule.getModel();

    var query = {
        name : DBUtils.createCaseInsensitiveLikeString( text )
    };

    var options = {
        limit : 5
    };

    var projection = {
        name : true,
        slug : true,
        '_id' : false
    };

    console.log( query );

    RestaurantModel.find( query, projection, options, function( err, result ) {
       if( err ) {
           callback( err );
       } else {
           callback( null, result );
       }
    });

    logger.info( 'In PublicRestaurantDBI | Finished Execution of findRestaurantsForAutoComplete' );
};

/* Private method to search for the menu title in the restaurants.
 * This method is used to be search for fetching options for menus. *
 */
var findDishesForAutoComplete = function( cityName, text, callback ) {
    logger.info( 'In PublicRestaurantDBI | Starting Execution of findDishesForAutoComplete' );

    var cityDBConnection = utils.getDBConnection( cityName );

    DishesModelModule.setUpConnection( cityDBConnection );
    var DishesModel = DishesModelModule.getModel();

    var query = {
        name : DBUtils.createCaseInsensitiveLikeString( text ),
        active : true
    };

    console.log( query );

    var options = {
        limit : 5
    };

    var projection = {
        '_id' : false,
        active : false
    };

    console.log( query );

    DishesModel.find( query, projection, options, function( err, result ) {
        if( err ) {
            callback( err );
        } else {
            callback( null, result );
        }
    });

    logger.info( 'In PublicRestaurantDBI | Finished Execution of findDishesForAutoComplete' );
};


/* Private method to search for cuisines for the given text.
 * This method is to be used for auto-complte code.
 */
var findCuisinesForAutoComplete = function( cityName, text, callback ) {
    logger.info( 'In PublicRestaurantDBI | Starting Execution of findCuisinesForAutoComplete' );

    var cityDBConnection = utils.getDBConnection( cityName );
    CuisineModelModule.setUpConnection( cityDBConnection );

    var CuisineModel = CuisineModelModule.getModel();

    var query = {
        name : DBUtils.createCaseInsensitiveLikeString( text )
    };

    var projection = {
        "_id" : false,
        "__v" : false,
        img : false,
        showOnHomePage : false
    };

    var options = {
        limit : 5
    };

    console.log( query );

    CuisineModel.find( query, projection, options, function( err, result ) {
        if ( err ) {
            callback( err );
        } else {
            callback( null, result );
        }
    });

    logger.info( 'In PublicRestaurantDBI | Finished Execution of findCuisinesForAutoComplete' );
};

/*              Public Method              */
/*=========================================*/

/* This public method will actually initiate three parallel calls for searching, restaurants, menu and cuisines in the system.
 * And combine their result, to finally produce a combined list.
 */
var getOptionsForTypeAhead = function( cityName, text, callback ) {
    logger.info( 'In PublicRestaurantDBI | Starting Execution of getOptionsForTypeAhead' );

    async.parallel({
        restaurants : async.apply( findRestaurantsForAutoComplete, cityName, text ),
        menu : async.apply( findDishesForAutoComplete, cityName, text ),
        cuisines : async.apply( findCuisinesForAutoComplete, cityName, text )
    }, function( err, result ) {
            console.log( err );
        console.log( result );
            if( err ) {
                callback( err );
            } else {
                callback( null, result );
            }
    });

    logger.info( 'In PublicRestaurantDBI | Finished Execution of getOptionsForTypeAhead' );
};

exports.getRestaurrantInfoBySlug = getRestaurrantInfoBySlug;
exports.searchRestaurants = searchRestaurants;
exports.getOptionsForTypeAhead = getOptionsForTypeAhead;