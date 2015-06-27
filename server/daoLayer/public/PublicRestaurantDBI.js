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
        slug : slug,
        approved : true
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

/*     Restaurant Search By Location And Cuisine Section    */
/*==========================================================*/

/* Private Methods */
/*=================*/

/* Private method to get restaurant count according to query specified. */
var getQueriedRestaurantCountContainingCuisineOrLocation = function( cityName, query, callback ) {
    logger.info( 'In PublicRestaurantDBI | Starting Execution of getQueriedRestaurantCountContainingCuisineOrLocation' );

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

    logger.info( 'In PublicRestaurantDBI | Finished Execution of getQueriedRestaurantCountContainingCuisineOrLocation' );
};

/* Private method to get queried restaurant data according to query.
 * This method would only be executed in case of first execution or fresh query.
 */
var getQueriedRestaurantDataContainingCuisineOrLocation = function( cityName, query, projection, pagingParams, callback ) {
    logger.info( 'In PublicRestaurantDBI | Starting Execution of getQueriedRestaurantDataContainingCuisineOrLocation' );

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

    logger.info( 'In PublicRestaurantDBI | Finished Execution of getQueriedRestaurantDataContainingCuisineOrLocation' );
};

/*  Public Method */

/* Public Method to search for a restaurant.
 * This method would be used for searching, not for fetching auto-complete options.
 */
var searchRestaurantsForLocationAndSearch = function( cityName, searchParam, pagingParams, callback ) {
    logger.info( 'In PublicRestaurantDBI | Starting Execution of searchRestaurantsForLocationAndSearch' );

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
        allStagesCompleted : false,
        menu : false
    };

    console.log( query );

    if(pagingParams.startIndex === 0 || null == pagingParams.startIndex || typeof pagingParams.startIndex === 'undefined' ) {
        async.parallel( {
            count : async.apply( getQueriedRestaurantCountContainingCuisineOrLocation, cityName, query ),
            result : async.apply( getQueriedRestaurantDataContainingCuisineOrLocation, cityName, query, projection, pagingParams )
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

    logger.info( 'In PublicRestaurantDBI | Finished Execution of searchRestaurantsForLocationAndSearch' );
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
        name : DBUtils.createCaseInsensitiveLikeString( text ),
        approved : true
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

/*               Restaurant Search By Menu                  */
/*==========================================================*/

/* Private Methods */
/*=================*/

/**
 * Private method to get count for restaurants offering queried dish.
 */
var getRestaurantCountOfferingADish = function( cityName, dishName , callback ) {
    logger.info( 'In PublicRestaurantDBI | Starting Execution of getRestaurantCountOfferingADish' );

    var cityDBConnection = utils.getDBConnection( cityName );

    restaurantModelModule.setUpConnection( cityDBConnection );
    var RestaurantModel = restaurantModelModule.getModel();

    var query = {
        'menu.items.title' : DBUtils.createCaseInsensitiveLikeString( dishName)
    };

    RestaurantModel.count( query, function(err, count ) {
        if( err ) {
            callback( err );
        } else {
            callback( null, count );
        }
    });

    logger.info( 'In PublicRestaurantDBI | Finished Execution of getRestaurantCountOfferingADish' );
};

/**
 * Private function to return first ten restaurants offering a particular dish.
 */
var getRestaurantDataOfferingQueriedDish = function( cityName, dishName, callback ) {
    logger.info( 'In PublicRestaurantDBI | Starting Execution of getRestaurantDataOfferingQueriedDish' );

    var cityDBConnection = utils.getDBConnection( cityName );

    restaurantModelModule.setUpConnection( cityDBConnection );
    var RestaurantModel = restaurantModelModule.getModel();

    var query = [
            { '$match' :
                { 'menu.items.title' : DBUtils.createCaseInsensitiveLikeString( dishName) }
            },

            {
                '$limit' : 10
            },

            { '$unwind' : '$menu' },
            { '$unwind' : '$menu.items' },
            { '$match' :
                { 'menu.items.title' : DBUtils.createCaseInsensitiveLikeString( dishName) }
            },

            { '$sort' : { '_id' : 1 }},

            { '$group' : {
                '_id' : '$_id',
                name : { '$first' : '$name'},
                menu : { '$push' : '$menu'}
            }},

            {
                '$project' : {
                    '_id' : false,
                    name : true,
                    menu : true,
                    slug : true
                }
            }
        ];

    RestaurantModel.aggregate( query, function( err, data ) {
        if( err ) {
            callback( err );
        } else {
            callback( null, data );
        }
    });

    logger.info( 'In PublicRestaurantDBI | Finished Execution of getRestaurantDataOfferingQueriedDish' );
};

/*              Public Method              */
/*=========================================*/

/**
 * Public Method to get restaurants offering particular dish.
 */
var getRestaurantsOfferingDish = function( cityName, dishName, startIndex, callback ) {
    logger.info( 'In PublicRestaurantDBI | Finished Execution of getRestaurantsOfferingDish' );

    if( startIndex == 0 ) {
        async.parallel(
            {
                count : async.apply( getRestaurantCountOfferingADish, cityName, dishName ),
                data : async.apply( getRestaurantDataOfferingQueriedDish, cityName, dishName )
            },

            function( err, result ) {
                if( err ) {
                    callback ( err );
                } else {
                    callback( null, result );
                }
            }
        );
    } else {

        var cityDBConnection = utils.getDBConnection( cityName );

        restaurantModelModule.setUpConnection( cityDBConnection );
        var RestaurantModel = restaurantModelModule.getModel();

        var query = [
            { '$match' :
                { 'menu.items.title' : DBUtils.createCaseInsensitiveLikeString( dishName ) }
            },

            {
                '$skip' : ( startIndex -1 )
            },

            {
                '$limit' : 10
            },

            { '$unwind' : '$menu' },
            { '$unwind' : '$menu.items' },
            { '$match' :
                { 'menu.items.title' : DBUtils.createCaseInsensitiveLikeString( dishName ) }
            },

            { '$sort' : { '_id' : 1 }},

            { '$group' : {
                '_id' : '$_id',
                name : { '$first' : '$name'},
                menu : { '$push' : '$menu'}
            }}
        ];

        RestaurantModel.aggregate( query, function( err, result ) {
            if( err ) {
                callback( err );
            } else {
                callback( null, result );
            }
        });

    }

    logger.info( 'In PublicRestaurantDBI | Finished Execution of getRestaurantsOfferingDish' );
};

exports.getRestaurrantInfoBySlug = getRestaurrantInfoBySlug;
exports.searchRestaurantsForLocationAndSearch = searchRestaurantsForLocationAndSearch;
exports.getOptionsForTypeAhead = getOptionsForTypeAhead;
exports.getRestaurantsOfferingDish = getRestaurantsOfferingDish;