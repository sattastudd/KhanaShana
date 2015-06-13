/**
 * In this file, we would handle Cuisine Related tasks.
 */

var appConstants = require( '../../../constants/ServerConstants' );
var CuisineDBI = require( '../../../daoLayer/admin/cuisine/AdminCuisineDBI' );
var Validator = require( '../../util/Validator' );

var setUpError = function( err, errMsg, type, responseFromValidator ) {
    err[ type ] = true;
    errMsg[ type ] = responseFromValidator.message;
};

/*                      Cuisine Search Section Begin                    */
/*===========================================================================*/

/*                              Public Methods                         */
/*======================================================================*/
/**
 * Method to search on Cuisines.
 */
var getCuisines = function( searchParam, pagingParam, callback ) {
    logger.info( 'In AdminCuisineService | Starting Execution of getCuisines' );

    var hasAnyValidationFailed = false;
    var responseFromValidatorForName = Validator.isNameNotValid( searchParam.name );
    var responseFromValidatorForStartIndex = Validator.isNumberNotValid( searchParam.startIndex );

    var err = {};
    var errMsg = {};

    if( responseFromValidatorForName.result ) {
        hasAnyValidationFailed = true;
        setUpError(err, errMsg, 'name', responseFromValidatorForName );
    }

    if( responseFromValidatorForStartIndex.result ) {
        hasAnyValidationFailed = true;
        setUpError(err, errMsg, 'startIndex', responseFromValidatorForStartIndex );
    }

    if( hasAnyValidationFailed ) {
        logger.error( 'In AdminCuisineService | Validation Failed ' );

        callback( appConstants.appErrors.validationError, {
            err : err,
            errMsg : errMsg,
            data : null,
            msg : appConstants.errorMessage.removeError
        });
    } else {
        if( pagingParam.startIndex === '' || pagingParam.startIndex == null || typeof pagingParam.startIndex === 'undefined' ) {
            pagingParam.startIndex = 0;
        }

        var cityName = 'lucknow';

        CuisineDBI.getCuisines( cityName, searchParam, pagingParam, function( err, result ) {
           if( err ) {
               logger.error( err );

               callback( appConstants.appErrors.someError, {
                   err : err,
                   errMsg : errMsg,
                   data : null,
                   msg : appConstants.errorMessage.someError
               });
           } else {
               if( result.count === 0 ) {
                   callback( appConstants.appErrors.noRecordFound, {
                       err : {},
                       errMsg : {},
                       data : null,
                       msg : appConstants.errorMessage.noRecordFound
                   })
               } else {
                   callback( null, {
                       err : {},
                       errMsg : {},
                       data : result,
                       msg : appConstants.successMessage
                   });
               }
           }
        });

    }
    logger.info( 'In AdminCuisineService | Finished Execution of getCuisines' );
};

exports.getCuisines = getCuisines;