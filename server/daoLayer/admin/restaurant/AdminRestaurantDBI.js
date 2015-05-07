/* This is DB Interaction file for Admin Restaurant related tasks. */
var RestaurantModelModule = require( '../../../models/restaurant/restaurants' );
var LocationsModelModule = require( '../../../models/locations/locationsModel.js' );
var CuisineModelModule = require( '../../../models/cuisines/cuisinesModel.js' );

var DBUtils = require( '../../util/DBIUtil' );
var appConstants = require( '../../../constants/ServerConstants' );

var async = require( 'async' );

/*                      Restaurant Creation Section Begin                    */
/*===========================================================================*/

/*              Private Methods             */
/*==========================================*/

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
var insertBasicDetails = function( cityName, restaurant, isSlugAlreadyBeingUsed, callback ){
    console.log( 'In RestaurantModelModule | Starting Execution of insertBasicDetails' );

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

    console.log( 'In RestaurantModelModule | Starting Execution of insertBasicDetails' );
};

/*              Public Methods             */
/*=========================================*/

/* This is public method to perform create operation on restaurants.
 * We will insert basic details with this method.
 * All other details would be performed in update method.
 * Except, approval functionality.
 */
var addNewRestaurant = function( cityName, restaurantToInsert, callback ) {

    /* TODO */
    /* 1 - Timing in HTML,
     2 - Timing in JS.
     3 - Average Cost computation.
     */

    console.log('In RestaurantModelModule | Starting Execution of addNewRestaurant');

    var slug = restaurantToInsert.slug;

    var restaurant = {
        name: restaurantToInsert.name,
        slug: restaurantToInsert.slug,

        'address.street': restaurantToInsert.address.street,
        'address.locality': restaurantToInsert.address.locality,
        'address.town': restaurantToInsert.address.town,
        'address.city': restaurantToInsert.address.city,
        'address.postal_code': restaurantToInsert.address.postal_code,
        'address.co_ord': restaurantToInsert.address.co_ord,

        owner: '',
        approved: false,

        stage: restaurantToInsert.stage
    };

    async.waterfall([
            async.apply(isSlugAlreadyBeingUsed, cityName, slug),
            async.apply(insertBasicDetails, cityName, restaurantToInsert)
        ],

        function (err, result) {
            if (err) {
                callback(err);
            } else {
                callback(null, result);
            }
        });

    console.log('In RestaurantModelModule | Finished Execution of addNewRestaurant');
};

/*                      Restaurant Creation Section End                    */
/*===========================================================================*/

/*                       Restaurant Search Section Begin                     */
/*===========================================================================*/

/*              Private Methods             */
/*==========================================*/

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

/*              Public Methods             */
/*=========================================*/
/*                              Public Methods                         */
/*======================================================================*/

/* This method would be used to extract restaurant info.*/
var getRestaurantList = function( searchParam, pagingParams, callback ){
    console.log( 'In AdminRestaurantDBI | Starting Execution of getRestaurantList' );

    var query = { $and : []};
    var orQuery = { $or : []};

    var isNameNotEmpty = !DBUtils.isFieldEmpty( searchParam.name );

    if( isNameNotEmpty ) {
        orQuery.$or.push({
            name: DBUtils.createCaseInsensitiveLikeString(searchParam.name)
        });
    }

    var isLocalityNotEmpty = !DBUtils.isFieldEmpty( searchParam.locality );

    if( isLocalityNotEmpty ) {
        orQuery.$or.push({
            delivery: DBUtils.createCaseInsensitiveLikeString(searchParam.locality)
        });
    }

    var isApprovedNotEmpty = !DBUtils.isFieldEmpty( searchParam.approved );

    if( isApprovedNotEmpty ) {
        //query.approved = searchParam.approved;
        query.$and.push( {
            approved : searchParam.approved
        });

        if( isNameNotEmpty || isLocalityNotEmpty ) {
            query.$and.push(orQuery);
        }
    } else {
        query = orQuery;
    }

    console.log( query );

    var projection = {

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


/*                        Restaurant Search Section End                      */
/*===========================================================================*/

/*                 Restaurant Specific Data Read Section Start               */
/*===========================================================================*/

var readRestaurantSpecificData = function( cityName, slug, callback ) {
    console.log( 'In AdminRestaurantDBI | Finished Execution of readRestaurantSpecificData' );

    var cityDBConnection = utils.getDBConnection( cityName );

    RestaurantModelModule.setUpConnection( cityDBConnection );
    var RestaurantModel = RestaurantModelModule.getModel();

    var query = {
        slug : slug
    };

    console.log( query );

    RestaurantModel.findOne( query, function( err, result ) {
        if( err ) {
            callback( err );
        } else {
            callback( null, result );
        }
    });

    console.log( 'In AdminRestaurantDBI | Finished Execution of readRestaurantSpecificData' );
};

/*                 Restaurant Specific Data Read Section End               */
/*===========================================================================*/

/*                                 Module Export                             */
/*===========================================================================*/
exports.addNewRestaurant = addNewRestaurant;
exports.getRestaurantList = getRestaurantList;

exports.readRestaurantSpecificData = readRestaurantSpecificData;