/**
 * This module would be used to update restaurant details by restaurant owner.
 */

var Validator = require( '../util/Validator' );
var RestaurantAdditionalDetailsDBI = require( '../../daoLayer/restOwn/RestaurantAdditionalDetailsDBI' );
var AppConstants = require( '../../constants/ServerConstants' );


var updateRestaurantInfo = function( restaurant, callback ) {
    logger.info( 'In RestaurantAdditionalDetailsService | Starting Execution of updateRestaurantInfo' );

    var err = {};
    var errMsg = {};

    var hasAnyValidationFailed = false;

    var responseFromValidatorForMinimumDelivery = Validator.isNumberNotValid( restaurant.minimumDelivery );
    var responseFromValidatorForCostForTwo = Validator.isNumberNotValid( restaurant.costForTwo );

    var responseFromValidatorForDeliveryTime = Validator.isNumberNotValid( restaurant.deliveryTime );
    //TODO change validation for open hours.
    var responseFromValidatorForOpenHours = Validator.isEverythingAllowed( restaurant.openHours );
    var responseFromValidatorForFileName = Validator.isFileNameNotValid( restaurant.snip );

    if( responseFromValidatorForMinimumDelivery.result ) {
        hasAnyValidationFailed = true;

        err.minimumDelivery = true;
        errMsg.minimumDelivery = responseFromValidatorForMinimumDelivery.message;
    }

    if( responseFromValidatorForCostForTwo.result ) {
        hasAnyValidationFailed = true;

        err.costForTwo = true;
        errMsg.costForTwo = responseFromValidatorForCostForTwo.message;
    }

    if( responseFromValidatorForDeliveryTime.result ){
        hasAnyValidationFailed = true;

        err.deliveryTime = true;
        errMsg.deliveryTime = responseFromValidatorForDeliveryTime.message;
    }

    if( responseFromValidatorForOpenHours.result ){
        hasAnyValidationFailed = true;

        err.openHours = true;
        errMsg.openHours = responseFromValidatorForOpenHours.message;
    }

    if( responseFromValidatorForFileName.result ) {
        hasAnyValidationFailed = true;

        err.snip = true;
        errMsg.snip = responseFromValidatorForFileName.message;
    } else {
        restaurant.snip = AppConstants.restaurantImagesPath + restaurant.slug + '/' + restaurant.slug + '-snip' + files.snip.name.substr(files.snip.name.indexOf('.'));
    }

    if( hasAnyValidationFailed ) {

        callback( AppConstants.appErrors.ValidationError, {
            err: err, errMsg : errMsg, data : null, msg : AppConstants.appErrors.removeError
        });

    } else {
        var cityName = 'lucknow';
        RestaurantAdditionalDetailsDBI.updateAdditionalDetails( cityName, restaurant, function(err, result ) {
            if( err ) {
                logger.error( 'Error in updateRestaurantInfo | RestaurantAdditionalDBI ' + JSON.stringify( result ));

                callback( AppConstants.appErrors.someError, {
                    err : {}, errMsg : {}, data : null, msg : AppConstants.errorMessage.someError
                });
            } else {

                callback( null, {
                    err : {}, errMsg : {}, data : result, msg : AppConstants.successMessage
                });

            }
        } );

    }

    logger.info( 'In RestaurantAdditionalDetailsService | Finished Execution of updateRestaurantInfo' );
};

/** Public Method to read restaurant specific data */
var readRestaurantAdditionalData =  function( restaurantSlug, callback ) {
    logger.info( 'In RestaurantAdditionalDetailsService | Starting Execution of readRestaurantAdditionalData' );

    var cityName = 'lucknow';

    RestaurantAdditionalDetailsDBI.readRestaurantAdditionalData( cityName, restaurantSlug, function( err, result ) {
        if( err ) {
            logger.error( 'Error in readRestaurantAdditionalData ' + JSON.stringify( err ));

            callback( AppConstants.appErrors.someError, {
                err : {}, errMsg : {}, data : null, msg : AppConstants.errorMessage.someError
            });
        } else {
            callback( null, result );
        }
    });

    logger.info( 'In RestaurantAdditionalDetailsService | Finished Execution of readRestaurantAdditionalData' );
};

exports.updateRestaurantInfo = updateRestaurantInfo;
exports.readRestaurantAdditionalData = readRestaurantAdditionalData;