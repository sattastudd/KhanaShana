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
var readRestaurantAdditionalData = function( cityName, slugName, callback ) {
    logger.info( 'In RestaurantAdditionalDetailsDBI | Starting Execution of readRestaurantAdditionalData' );

    var query = {
        slug : slugName
    };

    var projection = {
        '_id' : false,
        '__v' : false,
        allStagesCompleted : false,
        'address.locality' : false,
        'address.postal_code' : false,
        'address.street' : false,
        'address.town' : false,
        'address.city' : false,
        approved : false,
        cuisines : false,
        'delivery':false,
        'img.lg' : false,
        'img.md' : false,
        'img.sm' : false,
        'img.xs' : false,
        'menu' : false,
        'name' : false,
        'owner' : false,
        'slug' : false,
        'stage' : false
    };

    var cityDBConnection = utils.getDBConnection(cityName);

    RestaurantModelModule.setUpConnection(cityDBConnection);
    var RestaurantModel = RestaurantModelModule.getModel();

    RestaurantModel.findOne( query, projection, function( err, result ) {
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