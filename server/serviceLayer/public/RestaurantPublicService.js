/* This module acts as the service layer.
 * All the validations and mail service should be performed in here.
 */
var ServerConstants = require( '../../constants/ServerConstants' );
var RestaurantPublicDBI = require('../../daoLayer/public/PublicRestaurantDBI' );

var Validator = require( '../util/Validator' );

/* Private method to set up error */
var setUpError = function( err, errMsg, type, responseFromValidator ) {
    err[ type ] = true;
    errMsg[ type ] = responseFromValidator.message;
};

/*                          Restaurant Information Retrieval                        */
/*==================================================================================*/

/* Public method to retrieve restaurant info given its slug. */
var getRestaurantInfoBySlug = function ( cityName, slug, callback ) {
    logger.info( 'In RestaurantPublicService | Starting Execution of getRestaurantInfoBySlug' );

    var responseFromValidatorForSlug = Validator.isSlugNotValid( slug );

    if( responseFromValidatorForSlug.result ) {
        callback( ServerConstants.appErrors.validationError, {
            err : { slug : true },
            errMsg : { slug : responseFromValidatorForSlug.message },
            data : null,
            msg : ServerConstants.removeError
        });
    } else {

        /*Perform Validations here*/
        RestaurantPublicDBI.getRestaurrantInfoBySlug( cityName, slug, function( err, result ){
           if( err ){
               logger.error( 'In RestaurantPublicService | getRestaurantInfoBySlug ' + err );

               if( err === ServerConstants.appErrors.noRecordFound ) {

                   callback( ServerConstants.appErrors.noRecordFound, {
                       err : {},
                       errMap : {},
                       data : null,
                       msg : ServerConstants.errorMessage.noRecordFound
                   });
               } else {
                   callback( ServerConstants.appErrors.someError, {
                       err : {},
                       errMap : {},
                       data : null,
                       msg : ServerConstants.errorMessage.someError
                   });
               }
           } else {
               callback(null, {
                   err : {},
                   errMap :  {},
                   data : result,
                   msg : ServerConstants.successMessage
               });
           }
        });
    }
    logger.info( 'In RestaurantPublicService | Finished Execution of getRestaurantInfoBySlug' );
};

/*                              Restaurant Search Section                       */
/*==============================================================================*/

/* Public method to search restaurants to be displayed on search page. */
var searchRestaurants = function( searchParams, pagingParams, callback ) {
    logger.info( 'In RestaurantPublicService | Starting Execution of searchRestaurants' );

    var err = {};
    var errMsg = {};

    var hasAnyValidationFailed = false;

    var location = searchParams.location;
    var cuisine = searchParams.cuisine;

    var isLocationBlank = Validator.isFieldEmpty( location );
    var isCuisineBlank = Validator.isFieldEmpty( cuisine );

    if( isLocationBlank ) {
        delete searchParams.location;
    } else {
        var responseFromValidatorForLocation = Validator.isNameNotValid( location );

        if( responseFromValidatorForLocation.result ) {
            hasAnyValidationFailed = true;

            setUpError( err, errMsg, 'location', responseFromValidatorForLocation );
        }
    }

    if( isCuisineBlank ) {
        delete searchParams.cuisine;
    } else {
        var responseFromValidatorForCuisine = Validator.isNameNotValid( cuisine );

        if( responseFromValidatorForCuisine.result ) {
            hasAnyValidationFailed = true;

            setUpError( err, errMsg, 'cuisine', responseFromValidatorForCuisine );
        }
    }

    if( hasAnyValidationFailed ) {

        callback( ServerConstants.appErrors.validationError, {
            err : err,
            errMsg : errMsg,
            data : null,
            msg : ServerConstants.removeError
        });

    } else {
        var cityName = 'lucknow';

        RestaurantPublicDBI.searchRestaurants( cityName, searchParams, pagingParams, function( err, result ) {
            if( err ) {
                logger.error( 'In RestaurantPublicService | searchRestaurants' + JSON.stringify(err ));
            } else {

                if( result.count === 0 ) {
                    logger.error( 'In RestaurantPublicService | searchRestaurants ' + ServerConstants.errorMessage.noRecordFound );

                    callback( ServerConstants.appErrors.noRecordFound , {
                        err : {},
                        errMsg : {},
                        data : null,
                        msg : ServerConstants.errorMessage.noRecordFound
                    });
                } else {
                    callback( null, {
                        err : {},
                        errMsg : {},
                        data : result,
                        msg : ServerConstants.successMessage
                    });
                }

            }
        });

    }

    logger.info( 'In RestaurantPublicService | Finished Execution of searchRestaurants' );
};

exports.getRestaurantInfoBySlug = getRestaurantInfoBySlug;
exports.searchRestaurants = searchRestaurants;