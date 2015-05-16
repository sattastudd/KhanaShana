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

        var Restaurant = new RestaurantModel(restaurant);
        
        console.log(restaurant);

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
            async.apply(insertBasicDetails, cityName, restaurant)
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
    var isAllStagesCompletedNotEmpty = !DBUtils.isFieldEmpty( searchParam.allStagesCompleted );

    if( isApprovedNotEmpty || isAllStagesCompletedNotEmpty ) {

        if( isApprovedNotEmpty ) {
            query.$and.push( {
                approved : searchParam.approved
            });
        }

        if( isAllStagesCompletedNotEmpty ) {
            query.$and.push( {
                allStagesCompleted : searchParam.allStagesCompleted
            });
        }

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

/*                       Restaurant Update Section Begin                     */
/*===========================================================================*/

/*              Private Methods             */
/*==========================================*/

/* Private method to check if all received locations are present in the DB.
 * If are, only then, we can proceed to insert data into system.
 * Else, we will throw an error.
 *
 * locations => array of locations,
 * callback => passed by async.
 */
var areAllLocationsPresentInSystem = function (cityName, locations, callback) {
    console.log('In AdminRestaurantDBI | Starting Execution of areAllLocationsPresentInSystem');
    
    if (Array.isArray(locations) && locations.length > 0) {
        var cityDBConnection = utils.getDBConnection(cityName);
        LocationsModelModule.setUpConnection(cityDBConnection);
        
        var LocationsModel = LocationsModelModule.getModel();
        
        var locationsLength = locations.length;
        
        var innerQuery = [];
        
        for (var i = 0; i < locationsLength; i++) {
            var valueAt = locations[i];
            var obj = {
                name : new RegExp(valueAt, 'i')
            };
            
            innerQuery.push(obj);
        }
        
        var query = {
            $or : innerQuery
        };
        
        LocationsModel.count(query, function (err, resultCount) {
            if (err) {
                callback(err);
            } else {
                if (resultCount === locationsLength) {
                    callback(null, true);
                } else {
                    callback(appConstants.appErrors.validationError);
                }
            }
        });

    } else {
        callback(appConstants.appErrors.validationError);
    }
    
    console.log('In AdminRestaurantDBI | Finished Execution of areAllLocationsPresentInSystem');
};

/* Private Method to update locations info of restaurant.
 * This method would be executed after areAllLocationsPresentInSystem,
 * which ensures that all locations are valid.
 */
var updateLocationsInfoOfRestaurant = function (cityName, restSlug, locations, areAllLocationsPresentInSystem, callback) {
    console.log('In AdminRestaurantDBI | Starting Execution of updateLocationsInfoOfRestaurant');
    
    if (areAllLocationsPresentInSystem) {
        
        var cityDBConnection = utils.getDBConnection(cityName);
        
        RestaurantModelModule.setUpConnection(cityDBConnection);
        var RestaurantModel = RestaurantModelModule.getModel();
        
        var query = {
            slug : restSlug
        };
        
        var update = {
            $set : {
                'delivery' : locations,
                stage : 'deliveryAreas'
            }
        };
        
        RestaurantModel.update(query, update, function (err, result) {
            if (err) {
                callback(err);
            } else {
                callback(null, result);
            }
        });

    } else {
        callback(appConstants.appErrors.validationError);
    }
    
    console.log('In AdminRestaurantDBI | Finished Execution of updateLocationsInfoOfRestaurant');
};

/* Private Method to check if all received cuisines are present in the DB.
 * If are, only then, we can proceed to insert data into system.
 * Else, we will throw an error.
 *
 * cuisines => array of cuisines,
 * callback => passed by async.
 */
var areAllCuisinesPresentInSystem = function (cityName, cuisines, callback) {
    console.log('In AdminRestaurantDBI | Starting Execution of areAllCuisinesPresentInSystem');
    
    if (Array.isArray(cuisines) && cuisines.length > 0) {
        var cityDBConnection = utils.getDBConnection(cityName);
        CuisineModelModule.setUpConnection(cityDBConnection);
        
        var CuisineModel = CuisineModelModule.getModel();
        
        var cuisineLength = cuisines.length;
        
        var innerQuery = [];
        
        for (var i = 0; i < cuisineLength; i++) {
            var valueAt = cuisines[i];
            var obj = {
                name : new RegExp(valueAt, 'i')
            };
            
            innerQuery.push(obj);
        }
        
        var query = {
            $or : innerQuery
        };
        
        CuisineModel.count(query, function (err, resultCount) {
            if (err) {
                callback(err);
            } else {
                if (resultCount === cuisineLength) {
                    callback(null, true);
                } else {
                    callback(appConstants.appErrors.validationError);
                }
            }
        });

    } else {
        callback(appConstants.appErrors.validationError);
    }
    
    console.log('In AdminRestaurantDBI | Finished Execution of areAllCuisinesPresentInSystem');
};

/* Private Method to update cuisines info of restaurant.
 * This method would be executed after areAllCuisinesPresentInSystem,
 * which ensures that all locations are valid.
 */
var updateCuisinesInfoOfRestaurant = function (cityName, restSlug, cuisines, areAllCuisinesPresentInSystem, callback) {
    console.log('In AdminRestaurantDBI | Starting Execution of updateCuisinesInfoOfRestaurant');
    
    if (areAllCuisinesPresentInSystem) {
        
        var cityDBConnection = utils.getDBConnection(cityName);
        
        RestaurantModelModule.setUpConnection(cityDBConnection);
        var RestaurantModel = RestaurantModelModule.getModel();
        
        var query = {
            slug : restSlug
        };
        
        var update = {
            $set : {
                'cuisines' : cuisines,
                stage : 'cuisineArea'
            }
        };
        
        console.log(query);
        console.log(update);
        
        RestaurantModel.update(query, update, function (err, result) {
            if (err) {
                callback(err);
            } else {
                callback(null, result);
            }
        });

    } else {
        callback(appConstants.appErrors.validationError);
    }
    
    console.log('In AdminRestaurantDBI | Finished Execution of updateCuisinesInfoOfRestaurant');
};

/*               Public Methods             */
/*==========================================*/

/* This public method would be used to update the fields of restaurants in multiple stages.
 * This method would delegate execution to other private methods to update location and cuisine details.
 */
var updateRestaurantDetails = function( cityName, slug, restaurant, callback ) {

    console.log( 'In AdminRestaurantDBI | Starting Execution of updateRestaurantDetails' );

    /* Case if user wishes to update basic details itself. */
    if( restaurant.stage === 'basicDetails') {

        var query = { slug : slug };

        var updateQuery = { $set : {} };

        var options = { multi: false };

        var isNameNotEmpty = !DBUtils.isFieldEmpty( restaurant.name );
        var isSlugNotEmpty = !DBUtils.isFieldEmpty( restaurant.slug );

        var isStreetNotEmpty = !DBUtils.isFieldEmpty( restaurant.address.street );
        var isLocalityNotEmpty = !DBUtils.isFieldEmpty( restaurant.address.locality );
        var isTownNotEmpty = !DBUtils.isFieldEmpty( restaurant.address.town );
        var isCityNotEmpty = !DBUtils.isFieldEmpty( restaurant.address.city );
        var isPostalCodeNotEmpty = !DBUtils.isFieldEmpty( restaurant.address.postal_code );
        var isCoOrdNotEmpty = !DBUtils.isFieldEmpty( restaurant.address.co_ord );

        if( isNameNotEmpty ) {
            updateQuery.$set[ 'name' ] =  restaurant.name ;
        }

        if( isSlugNotEmpty ) {
            updateQuery.$set[ 'slug' ] = restaurant.slug;
        }

        if( isStreetNotEmpty ) {
            updateQuery.$set['address.street' ] =  restaurant.address.street;
        }

        if( isLocalityNotEmpty ) {
            updateQuery.$set['address.locality'] = restaurant.address.locality;
        }

        if( isTownNotEmpty ) {
            updateQuery.$set['address.town'] =  restaurant.address.town;
        }

        if( isCityNotEmpty ) {
            updateQuery.$set['address.city'] =  restaurant.address.city;
        }

        if( isPostalCodeNotEmpty ) {
            updateQuery.$set['address.postal_code'] = restaurant.address.postal_code;
        }

        if( isCoOrdNotEmpty ) {
            updateQuery.$set['address.co_ord'] =  restaurant.address.co_ord;
        }

        console.log(query);
        console.log(updateQuery);
        
        var cityDBConnection = utils.getDBConnection(cityName);
        
        RestaurantModelModule.setUpConnection(cityDBConnection);
        var RestaurantModel = RestaurantModelModule.getModel();
        
        RestaurantModel.update(query, updateQuery, options, function (err, updateCount) {
            if (err) {
                callback(err);
            } else {
                callback(null, updateCount);
            }
        });

    } else if (restaurant.stage === 'deliveryAreas') {
        
        var locations = restaurant.selectedLocations;        

        async.waterfall([
            async.apply(areAllLocationsPresentInSystem, cityName, locations),
            async.apply(updateLocationsInfoOfRestaurant, cityName, slug, locations)
        ],
            function (err, result) {
                if (err) {
                    callback(err);
                } else {
                    callback(null, result);
            }
        });
    } else if (restaurant.stage === 'cuisineArea') {

        var cuisines = restaurant.selectedCuisines;

        async.waterfall([
            async.apply(areAllCuisinesPresentInSystem, cityName, cuisines), 
            async.apply(updateCuisinesInfoOfRestaurant, cityName, slug, cuisines)
        ],
            function (err, result) {
                if (err) {
                    callback(err);
                } else {
                    callback(null, result);
                }
        });
    } else if (restaurant.stage === 'restMenu') {

        var cityDBConnection = utils.getDBConnection(cityName);
        
        RestaurantModelModule.setUpConnection(cityDBConnection);
        var RestaurantModel = RestaurantModelModule.getModel();
        
        var query = {
            slug : slug
        };
        
        var update = {
            $set : {
                menu : restaurant.menu,
                stage : 'restMenu'
            }
        };
        
        RestaurantModel.update(query, update, function (err, result) {
            if (err) {
                callback(err);
            } else {
                callback(null, result === 1);
            }
        });

    } else if (restaurant.stage === 'imgUpload') {
        var paths = restaurant.paths;

        var cityDBConnection = utils.getDBConnection(cityName);
        
        RestaurantModelModule.setUpConnection(cityDBConnection);
        var RestaurantModel = RestaurantModelModule.getModel();
        
        var query = {
            slug : slug
        };

        var update = {
            'img.lg' : paths.lg,
            'img.md' : paths.md,
            'img.sm' : paths.sm,
            'img.xs' : paths.xs,
            allStagesCompleted : true
        };
        
        console.log(query);
        console.log(update);

        RestaurantModel.update(query, update, function (err, updateCount) {
            if (err) {
                callback(err);
            } else {
                callback(null, updateCount);
            }
        })
    }

    console.log( 'In AdminRestaurantDBI | Finished Execution of updateRestaurantDetails' );
};

/*                        Restaurant Update Section End                      */
/*===========================================================================*/

/*                Restaurant Banner Image Path Retrieval Begin               */
/*===========================================================================*/

/* Public Method to retrieve banner image path of a restaurant.
 * We store file path instead of file in the db.
 * And the file path stored is relative to client side module.
 * So, we can only send the image data from controller after making up complete file path.
 */
var getRestaurantBannerImagePath = function( cityName, slug, type, callback ) {
    console.log('In AdminRestaurantDBI | Starting Execution of getRestaurantBannerImagePath');

    var cityDBConnection = utils.getDBConnection(cityName);

    RestaurantModelModule.setUpConnection(cityDBConnection);
    var RestaurantModel = RestaurantModelModule.getModel();

    var query = {
        slug : slug
    };

    var imgType = 'img.' + type;

    var projection = {};
    projection[ imgType ] = true;

    RestaurantModel.findOne( query, projection, function( err, result ) {
        if( err ) {
            callback( err );
        } else {
            console.log( result );
            callback( null, result ) ;
        }
    });

    console.log('In AdminRestaurantDBI | Finished Execution of getRestaurantBannerImagePath');
};

/*                 Restaurant Banner Image Path Retrieval End                */
/*===========================================================================*/

/*                                 Module Export                             */
/*===========================================================================*/
exports.addNewRestaurant = addNewRestaurant;
exports.getRestaurantList = getRestaurantList;
exports.updateRestaurantDetails = updateRestaurantDetails;

exports.readRestaurantSpecificData = readRestaurantSpecificData;
exports.getRestaurantBannerImagePath = getRestaurantBannerImagePath;