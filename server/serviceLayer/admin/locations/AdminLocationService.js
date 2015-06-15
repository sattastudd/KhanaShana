/** In this service, we will perform all location related tasks. */

var AppConstants = require( '../../../constants/ServerConstants' );
var AdminLocationDBI = require( '../../../daoLayer/admin/location/AdminLocationDBI' );
var Validator = require( '../../util/Validator' );

var getAllLocations = function( searchParam, pagingParam, callback ) {
    logger.info( 'In AdminLocationService | Starting Execution of getAllLocations' );

    var err = {};
    var errMsg = {};

    var hasAnyValidationFailed = false;

    var locationName = searchParam.name;
    var startIndex = pagingParam.startIndex;

    var isLocationEmpty = Validator.isFieldEmpty( locationName );
    var isStartIndexEmpty = Validator.isFieldEmpty( startIndex );

    if( isStartIndexEmpty ) {
        pagingParam.startIndex = 0;
    }

    if( !isLocationEmpty ) {
        var responseFromValidatorForName = Validator.isNameNotValid( locationName );

        if( responseFromValidatorForName.result ) {
            err.name = true;
            errMsg.name = responseFromValidatorForName.message;

            hasAnyValidationFailed = true;
        }
    }

    var responseFromValidatorForStartIndex = Validator.isNumberNotValid( startIndex );

    if( responseFromValidatorForStartIndex.result ) {
        err.startIndex = true;
        errMsg.startIndex = responseFromValidatorForStartIndex.message;

        hasAnyValidationFailed = true;
    }

    if( hasAnyValidationFailed ) {
        callback( AppConstants.appErrors.validationError, {
            err : err, errMsg : errMsg, data : null, msg : AppConstants.errorMessage.removeError
        });
    } else {

        var cityName = 'lucknow';

        AdminLocationDBI.getLocations( cityName, searchParam, pagingParam, function( err, result ) {
            if( err ) {
                logger.error( err );

                callback( AppConstants.appErrors.someError, {
                    err : {},
                    errMsg : {},
                    data : null,
                    msg : AppConstants.errorMessage.someError
                });
            } else {
                if( result.count === 0 ){
                    callback( AppConstants.appErrors.noRecordFound, {
                        err : {}, errMsg : {}, data : null, msg : AppConstants.errorMessage.noRecordFound
                    })
                } else {
                    callback( null, {
                        err : {}, errMsg : {}, data : result, msg : AppConstants.successMessage
                    });
                }
            }
        });
    }
    logger.info( 'In AdminLocationService | Finished Execution of getAllLocations' );
};

/**
 * Service method to insert new Location Into System
 */
var addNewLocation = function( locationName, callback ) {
    logger.info( 'In AdminLocationService | Starting Execution of addNewLocation' );

    var err = {}, errMsg = {}, hasAnyValidationFailed = false;

    var responseFromValidatorForLocationName = Validator.isNameNotValid( locationName, true );

    if( responseFromValidatorForLocationName.result ) {
        err.name = true;
        errMsg.name = responseFromValidatorForLocationName.message;

        hasAnyValidationFailed = true;
    }

    if( hasAnyValidationFailed ) {
        callback( AppConstants.appErrors.validationError, {
            err : err, errMsg : errMsg, data : null, msg : AppConstants.errorMessage.removeError
        });
    } else {
        var cityName = 'lucknow';

        AdminLocationDBI.addNewLocation( cityName, locationName, function( err, result ) {
            if( err ) {
                callback( err );
            } else {
                callback( null, {
                    err : {}, errMsg : {}, data : result, msg : 'Location with name ' + locationName + ' has been added.' });
            }
        });
    }

    logger.info( 'In AdminLocationService | Finished Execution of addNewLocation' );
};

exports.getAllLocations = getAllLocations;
exports.addNewLocation = addNewLocation;