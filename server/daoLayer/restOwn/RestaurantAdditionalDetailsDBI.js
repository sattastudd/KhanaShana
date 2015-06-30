/** This module would be used to update additional details of the restaurant.
 */

var mongoose = require( 'mongoose' );
var DBUtils = require( '../util/DBIUtil' );

var RestaurantModelModule = require( '../../models/restaurant/restaurants' );

var updateAdditionalDetails = function( cityName, restaurant, callback ) {
    logger.info( 'In RestaurantAdditionalDetailsDBI | Starting Execution of updateAdditionalDetails' );

    var query = {
        slug : restaurant.slug
    };

    var update = { $set : {}};

    var isMinimumDeliveryEmpty = DBUtils.isFieldEmpty( restaurant.minimumDelivery );
    var isCostForTwoEmpty = DBUtils.isFieldEmpty( restaurant.costForTwo );

    var isDeliveryTimeEmpty = DBUtils.isFieldEmpty( restaurant.deliveryTime );
    var isOpenHoursEmpty = DBUtils.isFieldEmpty( restaurant.openHours );

    var isSnipPathEmpty = DBUtils.isFieldEmpty( restaurant.snip );

    if( !isMinimumDeliveryEmpty ) {
        update.$set['cost.minimumDeliveryAt'] = restaurant.minimumDelivery;
    }

    if( !isCostForTwoEmpty ) {
        update.$set['cost.costForTwo'] = restaurant.costForTwo;
    }

    if( !isDeliveryTimeEmpty ) {
        update.$set['detail.delivery_time'] = restaurant.deliveryTime;
    }

    if( !isOpenHoursEmpty ) {
        update.$set['detail.timing'] = restaurant.openHours;
    }

    if( !isSnipPathEmpty ) {
        update.$set['img.snip'] = restaurant.snip;
    }

    var cityDBConnection = utils.getDBConnection(cityName);

    RestaurantModelModule.setUpConnection(cityDBConnection);
    var RestaurantModel = RestaurantModelModule.getModel();

    RestaurantModel.update( query, update, function( err, count ) {
        if( err ) {
            callback( err );
        } else {
            callback( null, count );
        }
    });

    logger.info( 'In RestaurantAdditionalDetailsDBI | Finished Execution of updateAdditionalDetails' );
};

/**
 * Function to read Restaurant Additional Data
 */
var readRestaurantAdditionalData = function( cityName, slugName ) {
    logger.info( 'In RestaurantAdditionalDetailsDBI | Starting Execution of readRestaurantAdditionalData' );

    var query = {
        slug : slugName
    };

    var projection = {
        '_id' : false,
        'address' : false,
        'img.snip' : true,
        'detail.timing' : true,
        'detail.delivery_time' : true,
        'cost.costForTwo' : true,
        'cost.minimumDeliveryAt' : true
    };

    var cityDBConnection = utils.getDBConnection(cityName);

    RestaurantModelModule.setUpConnection(cityDBConnection);
    var RestaurantModel = RestaurantModelModule.getModel();

    RestaurantModel.find( query, projection, function( err, result ) {
        if( err ) {
            callback( err );
        } else {
            callback( null, result );
        }
    });

    logger.info( 'In RestaurantAdditionalDetailsDBI | Finished Execution of readRestaurantAdditionalData' );
};

exports.updateAdditionalDetails = updateAdditionalDetails;
exports.readRestaurantAdditionalData = readRestaurantAdditionalData;