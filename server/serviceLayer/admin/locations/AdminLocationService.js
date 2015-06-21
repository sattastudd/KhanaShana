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
var addNewLocation = function( location, callback ) {
    logger.info( 'In AdminLocationService | Starting Execution of addNewLocation' );

    var err = {}, errMsg = {}, hasAnyValidationFailed = false;

    var locationName = location.locationName;
    var isOnHomePage = location.isOnHomePage;

    var responseFromValidatorForLocationName = Validator.isNameNotValid( locationName, true );
    var responseFromValidatorForIsOnHomePage = Validator.isBooleanNotValid( isOnHomePage, true );

    if( responseFromValidatorForLocationName.result ) {
        err.name = true;
        errMsg.name = responseFromValidatorForLocationName.message;

        hasAnyValidationFailed = true;
    }

    if( responseFromValidatorForIsOnHomePage.result ) {
        err.isOnHomePage = true;
        errMsg.isOnHomePage = responseFromValidatorForIsOnHomePage.message;

        hasAnyValidationFailed = true;
    }

    if( hasAnyValidationFailed ) {
        callback( AppConstants.appErrors.validationError, {
            err : err, errMsg : errMsg, data : null, msg : AppConstants.errorMessage.removeError
        });
    } else {
        var cityName = 'lucknow';

        AdminLocationDBI.addNewLocation( cityName, location, function( err, result ) {
            if( err ) {
                logger.error( 'Error in AdminLocationService | addNewLocation' + err );

                callback( err, {
                    err : {}, errMsg : {}, data : result, data : null, msg : AppConstants.errorMessage.existingLocation.replace('{{1}}', location.locationName)
                });
            } else {
                callback( null, {
                    err : {}, errMsg : {}, data : result, msg : 'Location with name ' + locationName + ' has been added.' });
            }
        });
    }

    logger.info( 'In AdminLocationService | Finished Execution of addNewLocation' );
};

/**
 * Public method to delete a location.
 */
var deleteLocation = function( locationName, callback ) {
    logger.info( 'In AdminLocationService | Starting Execution of deleteLocation' );

    var err= {}, errMsg = {}, hasAnyValidationFailed = false;

    var responseFromValidatorForLocationName = Validator.isNameNotValid( locationName );

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

        AdminLocationDBI.deleteLocation( cityName, locationName, function( err, result ) {
            if( err ) {
                if( err === AppConstants.appErrors.locationInUse ) {
                    callback( AppConstants.appErrors.locationInUse, {
                        err : {}, errMsg : {}, data : null, msg : AppConstants.errorMessage.locationInUse.replace('{{1}}', locationName )
                    });
                } else {
                    callback( AppConstants.appErrors.someError, {
                        err : {}, errMsg : {}, data : null, msg : AppConstants.errorMessage.someError
                    });
                }
            } else {
                if( result <= 0 ) {
                    callback( AppConstants.appErrors.deleteFailed, {
                        err : {}, errMsg : {}, data : null, msg : AppConstants.errorMessage.deleteFailed
                    });
                } else {
                    callback( null, {
                        err : {}, errMsg : {}, data : result, msg : AppConstants.locationDeleted.replace( '{{1}}', locationName )
                    });
                }
            }
        });
    }

    logger.info( 'In AdminLocationService | Finished Execution of deleteLocation' );
};

/**
 * Public method to update a new location.
 */
var updateLocation = function( oldLocationObject, newLocationObject, callback ) {
    logger.info( 'In AdminLocationService | Starting Execution of updateLocation' );

    var err = {}, errMsg = {}, hasAnyValidationFailed = false;

    //We will validate both but will send errors for newLocationObject only.
    if( null != oldLocationObject && typeof oldLocationObject !== 'undefined' ) {

        var responseFromValidatorForOldLocationName = Validator.isNameNotValid( oldLocationObject.locationName, true );
        var responseFromValidatorForOldIsOnHomePage = Validator.isBooleanNotValid( oldLocationObject.isOnHomePage, true );

        if( responseFromValidatorForOldLocationName.result ) {
            hasAnyValidationFailed = true;
        }

        if( responseFromValidatorForOldIsOnHomePage.result ) {
            hasAnyValidationFailed = true;
        }
    } else {
        callback( AppConstants.appErrors.validationError, {
            err : {}, errMsg : {}, data : null, msg : AppConstants.errorMessage.oldObjectNull
        });

        return;
    }

    if( null != newLocationObject && typeof newLocationObject !== 'undefined' ) {

        var responseFromValidatorForNewLocationName = Validator.isNameNotValid( newLocationObject.locationName, true );
        var responseFromValidatorForNewisOnHomePage = Validator.isBooleanNotValid( newLocationObject.isOnHomePage, true );

        if( responseFromValidatorForNewLocationName.result ) {
            err.name = true;
            errMsg.name = responseFromValidatorForNewLocationName.message;

            hasAnyValidationFailed = true;
        }

        if( responseFromValidatorForNewisOnHomePage.result ) {
            err.isOnHomePage = true;
            errMsg.isOnHomePage = responseFromValidatorForNewisOnHomePage.message;

            hasAnyValidationFailed = true;
        }

    } else {
        callback( AppConstants.appErrors.validationError, {
            err : {}, errMsg : {}, data : null, msg : AppConstants.errorMessage.newObjectNull
        });

        return;
    }

    if( hasAnyValidationFailed ) {
        callback( AppConstants.appErrors.validationError, {
            err : err, errMsg : errMsg, data : null, msg : AppConstants.errorMessage.removeError
        });
    } else {

        var cityName = 'lucknow';
        AdminLocationDBI.updateLocation( cityName, oldLocationObject, newLocationObject, function( err, result ) {
            if( err ) {
                logger.error( 'Error In ' + 'AdminLocationService | updateLocation ' + err );

                callback( AppConstants.appErrors.someError, {
                    err : {}, errMsg : {}, data : null, msg : AppConstants.errorMessage.someError
                });
            } else {

                callback( null, {
                    err : {}, errMsg : {}, data : result, msg : AppConstants.locationHasBeenUpdated.replace('{{1}}', oldLocationObject.locationName )
                });

            }
        });

    }

    logger.info( 'In AdminLocationService | Finished Execution of updateLocation' );
};

exports.getAllLocations = getAllLocations;
exports.addNewLocation = addNewLocation;
exports.deleteLocation = deleteLocation;
exports.updateLocation = updateLocation;