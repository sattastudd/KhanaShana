/* This service layer would handle validation of a pending order.
 */

var ServerConstants = require( '../../../constants/ServerConstants' );
var PendingRestaurantDBI = require( '../../../daoLayer/customer/order/PendingOrdersDBI' );

var Validator = require( '../../util/Validator' );

/**
 * Private Service layer method to add an order into pending orders list.
 * @param userInfo
 * @param restaurantInfo
 * @param orderedDishes
 * @param callback
 */
var addOrderIntoPendingOrdersList = function( userEmail, restaurantInfo, orderedDishes, callback ) {
    logger.info( 'In PendingOrdersService | Starting Execution of addOrderIntoPendingOrdersList' );

    var err = {items : [], restaurant : {}};
    var errMsg = {items : [], restaurant : {}};

    var hasAnyValidationFailed = false;

    var responseFromValidatorForUserEmail = Validator.isEmailNotValid( userEmail, true );

    var responseFromValidatorForRestaurantName = Validator.isNameNotValid( restaurantInfo.name, true );
    var responseFromValidatorForRestaurantSlug = Validator.isSlugNotValid( restaurantInfo.slug, true );

    var orderedDishesLength = orderedDishes.length;

    for( var i=0; i <orderedDishesLength; i++ ) {
        var dish = orderedDishes[i];

        var responseFromValidatorForDishName = Validator.isNameNotValid( dish.dish, true );
        var responseFromValidatorForDishType = Validator.isDishTypeNotValid( dish.value, true );

        var dishErr = {};
        var dishErrMsg = {};

        if( responseFromValidatorForDishName.result ) {
            hasAnyValidationFailed = true;

            dishErr.dish = true;
            dishErrMsg.dish = responseFromValidatorForDishName.message;
        }

        if( responseFromValidatorForDishType.result ) {
            hasAnyValidationFailed = true;

            dishErr.type = true;
            dishErrMsg.type = responseFromValidatorForDishType.message;
        }

        err.items.push( dishErr );
        errMsg.items.push( dishErrMsg );
    }

    if( responseFromValidatorForUserEmail.result ) {
        hasAnyValidationFailed = true ;

        err.email = true;
        errMsg.email = responseFromValidatorForUserEmail.message;
    }

    if( responseFromValidatorForRestaurantName.result ) {
        hasAnyValidationFailed = true;

        err.restaurant.name = true;
        errMsg.restaurant.name = responseFromValidatorForRestaurantName.message;
    }

    if( responseFromValidatorForRestaurantSlug.result ) {
        hasAnyValidationFailed = true;

        err.restaurant.slug = true;
        errMsg.restaurant.slug = responseFromValidatorForRestaurantSlug.message;
    }

    if( hasAnyValidationFailed ) {
        callback( ServerConstants.appErrors.validationError, {
            err : err, errMsg : errMsg, data : null, msg : ServerConstants.errorMessage.removeError
        });
    } else {

        var cityName = 'lucknow';

        PendingRestaurantDBI.addOrderIntoPendingOrdersList( cityName, userEmail, restaurantInfo, orderedDishes, function( err, result ) {
            if( err ) {
                logger.error( 'In PendingOrderService | Error in addOrderIntoPendingOrdersList ' + JSON.stringify( err ));

                callback( ServerConstants.appErrors.someError, {
                    err : err, errMsg : errMsg, data : null, msg : ServerConstants.errorMessage.someError
                });
            } else {
                delete result['__v'];
                delete result['pending_state_date'];
                delete result.user;

                callback( null, {
                    err : {}, errMsg : {}, data : result, msg : ServerConstants.successMessage
                });
            }
        });

    }


    logger.info( 'In PendingOrdersService | Finished Execution of addOrderIntoPendingOrdersList' );
};

exports.addOrderIntoPendingOrdersList = addOrderIntoPendingOrdersList;