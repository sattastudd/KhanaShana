/* This is DB Interaction file for Admin Restaurant related tasks. */
var RestaurantModelModule = require( '../../../models/restaurant/restaurants' );
var LocationsModelModule = require( '../../../models/locations/locationsModel.js' );
var CuisineModelModule = require( '../../../models/cuisines/cuisinesModel.js' );

var DBUtils = require( '../../util/DBIUtil' );
var appConstants = require( '../../../constants/ServerConstants' );

var async = require( 'async' );

/* Private method to retrieve Restaurant Count
 * This would only be executed if there is we have first time search.
 */
var getRestaurantCount = function( searchParams, query, callback ) {
    console.log( 'In AdminRestaurantDBI | Starting Execution of getRestaurantCount' );

    var cityDBConnection = utils.getDBConnection( searchParams.cityName );

    RestaurantModelModule.setUpConnection( cityDBConnection );
    var RestaurantModel = RestaurantModelModule.getModel();

    RestaurantModel.count(query, function( err, count ){
        if( err ) {
            callback( err );
        } else {
            callback( null, count );
        }
    });
    console.log( 'In AdminRestaurantDBI | Finished Execution of getRestaurantCount' );
};

/* Private method to search or first retrieval of data.
 * This method would only be called in first call of search.
 */
var getRestaurantListForFirstTime = function( searchParam, pagingParams, query, projection, callback ){

    console.log( 'In AdminRestaurantDBI | Starting Execution of getRestaurantListForFirstTime' );

    var cityDBConnection = utils.getDBConnection( searchParam.cityName );

    RestaurantModelModule.setUpConnection( cityDBConnection );
    var RestaurantModel = RestaurantModelModule.getModel();

    var options = {
        sort : {
            createDate : 'desc'
        }
    };

    if( pagingParams.startIndex != null ){
        options.skip = pagingParams.startIndex;
        options.limit = 10;
    };

    RestaurantModel.find( query, projection, options, function( err, result ){
        if( err ){
            callback( err );
        } else {
            callback( null, result );
        }
    });
    console.log( 'In AdminRestaurantDBI | Finished Execution of getRestaurantListForFirstTime' );
};

/* Private method to check if all received locations are present in the DB.
 * If are, only then, we can proceed to insert data into system.
 * Else, we will throw an error.
 *
 * locations => array of locations,
 * callback => passed by async.
 */
var areAllLocationsPresentInSystem = function( cityName, locations, callback ){
    console.log( 'In AdminRestaurantDBI | Starting Execution of areAllLocationsPresentInSystem' );

    if( Array.isArray( locations ) && locations.length > 0){
        var cityDBConnection = utils.getDBConnection( cityName );
        LocationsModelModule.setUpConnection( cityDBConnection );

        var LocationsModel = LocationsModelModule.getModel();

        var locationsLength = locations.length;

        var innerQuery = [];

        for( var i=0;i<locationsLength; i++){
            var valueAt = locations[i];
            var obj = {
                name : new RegExp( valueAt, 'i')
            };

            innerQuery.push( obj );
        }

        var query = {
            $or : innerQuery
        };

        LocationsModel.count( query, function(err, resultCount){
            if( err ) {
                callback( err );
            } else {
                if( resultCount === locationsLength) {
                    callback( null, true );
                } else {
                    callback( appConstants.appErrors.validationError);
                }
            }
        });

    } else {
        callback( appConstants.appErrors.validationError);
    }

    console.log( 'In AdminRestaurantDBI | Finished Execution of areAllLocationsPresentInSystem' );
};

/* Private Method to update locations info of restaurant.
 * This method would be executed after areAllLocationsPresentInSystem,
 * which ensures that all locations are valid.
 */
var updateLocationsInfoOfRestaurant = function( cityName, restSlug, locations, areAllLocationsPresentInSystem ) {
    console.log( 'In AdminRestaurantDBI | Starting Execution of updateLocationsInfoOfRestaurant' );

    if( areAllLocationsPresentInSystem ){

        var cityDBConnection = utils.getDBConnection( cityName );

        RestaurantModelModule.setUpConnection( cityDBConnection );
        var RestaurantModel = RestaurantModelModule.getModel();

        var query = {
            slug : restSlug
        };

        var update = {
            $set : locations
        };

        RestaurantModel.update( query, update, function( err, result ){
            if( err ) {
                callback( err );
            } else {
                callback( null, result);
            }
        });

    } else {
        callback( appConstants.appErrors.validationError );
    }

    console.log( 'In AdminRestaurantDBI | Finished Execution of updateLocationsInfoOfRestaurant' );
};

/* Private Method to check if all received cuisines are present in the DB.
 * If are, only then, we can proceed to insert data into system.
 * Else, we will throw an error.
 *
 * cuisines => array of cuisines,
 * callback => passed by async.
 */
var areAllCuisinesPresentInSystem = function( cityName, cuisines, callback ){
    console.log( 'In AdminRestaurantDBI | Starting Execution of areAllCuisinesPresentInSystem' );

    if( Array.isArray( cuisines ) && cuisines.length > 0){
        var cityDBConnection = utils.getDBConnection( cityName );
        CuisineModelModule.setUpConnection( cityDBConnection );

        var CuisineModel = CuisineModelModule.getModel();

        var cuisineLength = cuisines.length;

        var innerQuery = [];

        for( var i=0;i<cuisineLength; i++){
            var valueAt = cuisines[i];
            var obj = {
                name : new RegExp( valueAt, 'i')
            };

            innerQuery.push( obj );
        }

        var query = {
            $or : innerQuery
        };

        CuisineModel.count( query, function(err, resultCount){
            if( err ) {
                callback( err );
            } else {
                if( resultCount === cuisineLength) {
                    callback( null, true );
                } else {
                    callback( appConstants.appErrors.validationError);
                }
            }
        });

    } else {
        callback( appConstants.appErrors.validationError);
    }

    console.log( 'In AdminRestaurantDBI | Finished Execution of areAllCuisinesPresentInSystem' );
};

/* Private Method to update cuisines info of restaurant.
 * This method would be executed after areAllCuisinesPresentInSystem,
 * which ensures that all locations are valid.
 */
var updateCuisinesInfoOfRestaurant = function( cityName, restSlug, cuisines, areAllCuisinesPresentInSystem ) {
    console.log( 'In AdminRestaurantDBI | Starting Execution of updateCuisinesInfoOfRestaurant' );

    if( areAllCuisinesPresentInSystem ){

        var cityDBConnection = utils.getDBConnection( cityName );

        CuisineModelModule.setUpConnection( cityDBConnection );
        var CuisineModel = CuisineModelModule.getModel();

        var query = {
            slug : restSlug
        };

        var update = {
            $set : cuisines
        };

        CuisineModel.update( query, update, function( err, result ){
            if( err ) {
                callback( err );
            } else {
                callback( null, result);
            }
        });

    } else {
        callback( appConstants.appErrors.validationError );
    }

    console.log( 'In AdminRestaurantDBI | Finished Execution of updateCuisinesInfoOfRestaurant' );
};

/* Private Method to check if slug field is already used. */
var isSlugAlreadyBeingUsed = function( cityName, slug, callback ) {
    console.log( 'In RestaurantModelModule | Starting Execution of isSlugAlreadyBeingUsed' );

    var cityDBConnection = utils.getDBConnection( cityName );

    RestaurantModelModule.setUpConnection( cityDBConnection );
    var RestaurantModel = RestaurantModelModule.getModel();

    var query = {
        slug : slug
    };

    RestaurantModel.count( query, function( err, result ) {
        if( err ) {
            callback( err );
        } else {
            console.log( 'SLug Count ' + result );
            if( result != 0 ){
                callback( appConstants.appErrors.intentionalBreak );
            } else {
                callback( null, false );
            }
        }
    });

    console.log( 'In RestaurantModelModule | Starting Execution of isSlugAlreadyBeingUsed' );
};

/* Private method to insert basic details of restaurant into database.
 * This method would be executed after isSlugAlreadyBeingUsed
 */
var doInsertBasicDetails = function( cityName, restaurant, isSlugAlreadyBeingUsed, callback ){
    console.log( 'In RestaurantModelModule | Starting Execution of doInsertBasicDetails' );

    if( isSlugAlreadyBeingUsed ) {
        callback( appConstants.appErrors.intentionalBreak );
        return;
    } else {
        var cityDBConnection = utils.getDBConnection( cityName );

        RestaurantModelModule.setUpConnection( cityDBConnection );
        var RestaurantModel = RestaurantModelModule.getModel();

        var Restaurant = new RestaurantModel( restaurant );

        Restaurant.save( function ( err, result ) {
            if( err ) {
                callback ( err );
            } else {
                callback( null, result );
            }
        });
    }

    console.log( 'In RestaurantModelModule | Starting Execution of doInsertBasicDetails' );
};

/*                              Public Methods                         */
/*======================================================================*/

/* This method would be used to extract restaurant info.*/
var getRestaurantList = function( searchParam, pagingParams, query, callback ){
    console.log( 'In AdminRestaurantDBI | Starting Execution of getRestaurantList' );

    var isNameNotEmpty = !DBUtils.isFieldEmpty( searchParam.name );

    if( isNameNotEmpty ) {
        query.name  = DBUtils.createCaseInsensitiveLikeString( searchParam.name );
    }

    var isLocalityNotEmpty = !DBUtils.isFieldEmpty( searchParam.locality );

    if( isLocalityNotEmpty ) {
        query.delivery = DBUtils.createCaseInsensitiveLikeString( searchParam.locality );
    }

    var projection = {

        '_id' : false,
        "__v": false,
        createDate : false,
        address : false,
        cuisines : false,
        cost : false,
        'detail.timing' : false,
        'detail.rating' : false,
        'detail.total_votes' : false,

        menu : false,
        img : false
    };

    if(pagingParams.startIndex === 0 || null == pagingParams.startIndex || typeof pagingParams.startIndex === 'undefined' ) {
        async.parallel({
                count : async.apply( getRestaurantCount, searchParam, query),
                result : async.apply( getRestaurantListForFirstTime, searchParam, pagingParams, query, projection )
            },

            function( err, results ) {
                if( err ){
                    callback( err );
                } else {

                    callback( null, results );
                }
            });
    } else {

        var cityDBConnection = utils.getDBConnection( searchParam.cityName );

        RestaurantModelModule.setUpConnection( cityDBConnection );
        var RestaurantModel = RestaurantModelModule.getModel();

        var options = {
            skip : ( pagingParams.startIndex - 1),
            limit : 10,
            sort : {
                createDate : 'desc'
            }
        };

        RestaurantModel.find( query, projection, options, function( err, result ){
            if( err ){
                callback( err );
            } else {
                callback( null, {result : result });
            }
        });
    }
    console.log( 'In AdminRestaurantDBI | Finished Execution of getRestaurantList' );
};

/* This method would be used to add a new restaurants into system.
 * After this, restaurant moves into approval list, where a restaurant-owner type user would be allocated to the restaurant.
 * Once approved, restaurant would be ready to displayed on client side.
 */
var addNewRestaurant = function( cityName, restaurantToInsert, callback ) {

    /* TODO */
    /* 1 - Timing in HTML,
     2 - Timing in JS.
     3 - Average Cost computation.
     */

    console.log( 'In RestaurantModelModule | Starting Execution of addNewRestaurant' );



    var stage = restaurantToInsert.stage;

    if( stage === 'basicDetails' ){

        var slug = restaurantToInsert.slug;

        var restaurant = {
            name : restaurantToInsert.name,
            slug : restaurantToInsert.slug,

            'address.street' : restaurantToInsert.address.street,
            'address.locality' : restaurantToInsert.address.locality,
            'address.town' : restaurantToInsert.address.town,
            'address.city' : restaurantToInsert.address.city,
            'address.postal_code' : restaurantToInsert.address.postal_code,
            'address.co_ord' : restaurantToInsert.address.co_ord,

            owner : '',
            approved : false,

            stage : restaurantToInsert.stage
        }

        async.waterfall([
            async.apply( isSlugAlreadyBeingUsed, cityName, slug ),
            async.apply( doInsertBasicDetails, cityName, restaurant )
        ],
            function( err, result ) {
                if( err ) {
                    callback( err );
                } else {
                    callback( null, result );
                }
            });
    }
    else if( stage === 'deliveryAreas' ) {

        async.waterfall([
                async.apply( areAllLocationsPresentInSystem, cityName, restaurantToInsert.locations ),
                async.apply( updateLocationsInfoOfRestaurant, cityName, restaurantToInsert.slug, restaurantToInsert.locations)
            ],
            function( err, result ){
                if( err ){
                    callback( err );
                } else {
                    callback( null, result === 1);
                }
            }
        );
    } else if( stage === 'cuisineArea' ){

        async.waterfall([
                async.apply( areAllCuisinesPresentInSystem, cityName, restaurantToInsert.cuisines ),
                async.apply( updateCuisinesInfoOfRestaurant, cityName, restaurantToInsert.slug, restaurantToInsert.cuisines)
            ],
            function( err, result ){
                if( err ){
                    callback( err );
                } else {
                    callback( null, result === 1);
                }
            }
        );

    } else if( stage === 'restMenu' ) {
        var cityDBConnection = utils.getDBConnection( cityName );

        RestaurantModelModule.setUpConnection( cityDBConnection );
        var RestaurantModel = RestaurantModelModule.getModel();

        var query = {
            slug : restaurantToInsert.slug
        };

        var update = {
            $set : {
                menu : restaurantToInsert.menu
            }
        };

        RestaurantModel.update( query, update, function( err, result ){
            if( err ){
                callback( err );
            } else {
                callback( null, result === 1);
            }
        } );
    } else if( stage === 'imgUpload' ) {
        var cityDBConnection = utils.getDBConnection( cityName );

        RestaurantModelModule.setUpConnection( cityDBConnection );
        var RestaurantModel = RestaurantModelModule.getModel();

        var query = {
            slug : restaurantToInsert.slug
        };

        var update = {
            $set : {
                lg : restaurantToInsert.image.lgPath,
                md : restaurantToInsert.image.mdPath,
                sm : restaurantToInsert.image.smPath,
                xs : restaurantToInsert.image.xsPath,
            }
        };

        RestaurantModel.update( query, update, function( err, result ){
            if( err ){
                callback( err );
            } else {
                callback( null, result === 1);
            }
        } );
    } else {
        callback( appConstants.appErrors.validationError );
    }

    console.log( 'In RestaurantModelModule | Finished Execution of addNewRestaurant' );
};

/* This method would be used to fetch the data of the restaurant using its slug. */
var getRestaurantInfoBySlug = function( cityName, slug ) {
    console.log( 'In AdminRestaurantService | Starting Execution of getRestaurantInfoBySlug' );

    var cityDBConnection = utils.getDBConnection( cityName );

    RestaurantModelModule.setUpConnection( cityDBConnection );
    var RestaurantModel = RestaurantModelModule.getModel();

    var query = {
        slug: slug
    };

    RestaurantModel.findOne( query, function( err, result ) {
        if( err ) {
            callback( err );
        } else {
            callback( null, result );
        }
    } );

    console.log( 'In AdminRestaurantService | Starting Execution of getRestaurantInfoBySlug' );
};

exports.getRestaurantInfoBySlug = getRestaurantInfoBySlug;

exports.addNewRestaurant = addNewRestaurant;
exports.getRestaurantList = getRestaurantList;