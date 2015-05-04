/* This is DB Interaction file for Admin Restaurant related tasks. */
var RestaurantModelModule = require( '../../../models/restaurant/restaurants' );
var DBUtils = require( '../../util/DBIUtil' );

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

    console.log( query );


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

    console.log( query );

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
        console.log( pagingParams.startIndex );
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

        console.log( options.skip );

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


var addNewRestaurant = function( cityName, restaurantToInsert, callback ) {

    console.log( 'In RestaurantModelModule | Starting Execution of addNewRestaurant' );

    var cityDBConnection = utils.getDBConnection( cityName );

    RestaurantModelModule.setUpConnection( cityDBConnection );
    var RestaurantModel = RestaurantModelModule.getModel();

    var stage = restaurantToInsert.stage;

    if( stage === 'basicDetails' ){

        var Restaurant = new RestaurantModel({
            name : restaurantToInsert.name,
            slug : restaurantToInsert.slug,

            'address.street' : restaurantToInsert.address.street,
            'address.locality' : restaurantToInsert.address.locality,
            'address.town' : restaurantToInsert.address.town,
            'address.city' : restaurantToInsert.address.city,
            'address.postal_code' : restaurantToInsert.address.postal_code,
            'address.co_ord' : restaurantToInsert.address.co_ord,

            owner : '',
            approved : false
        });

        Restaurant.save( function ( err, result ) {
            if( err ) {
                callback ( err );
            } else {
                callback( null, result );
            }
        });
    }
    console.log( 'In RestaurantModelModule | Finished Execution of addNewRestaurant' );
};

exports.addNewRestaurant = addNewRestaurant;
exports.getRestaurantList = getRestaurantList;