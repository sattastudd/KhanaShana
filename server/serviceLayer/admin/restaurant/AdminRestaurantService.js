/*In here, we will handle Users Related Information
 */

var appConstants = require( '../../../constants/ServerConstants' );
var RestaurantDBI = require( '../../../daoLayer/admin/restaurant/AdminRestaurantDBI' );

var Validator = require( '../../util/Validator' );

var setUpError = function (err, errMsg, type, response) {
    err[type] = response.result;
    errMsg[type] = response.message;
};

/* This is public utility method to search and retrieve approved restaurant list from application.*/
var getApprovedRestaurantList = function( searchParams, pagingParams, callback ){
    console.log( 'In AdminRestaurantService | Starting Execution of getApprovedRestaurantList' );

    /*Starting Validation here.*/
    var name = searchParams.name;
    var locality = searchParams.locality;

    searchParams.cityName = 'lucknow';

    var hasAnyValidationFailed = false;
    var responseMessage  = '';

    var isNameBlank = Validator.isFieldEmpty( name );
    var islocalityBlank = Validator.isFieldEmpty( locality );

    if( isNameBlank ){
        delete searchParams.name;
    } else {

        var resultForName = Validator.isNameNotValid( name );

        if( resultForName.result ){
            hasAnyValidationFailed = true;
            responseMessage = resultForName.message;
        }
    }

    if( islocalityBlank ) {
        delete  searchParams.locality;
    } else {
        var resultForLocality = Validator.isEmailNotValid( locality );

        if( resultForLocality.result ) {
            hasAnyValidationFailed = true;
            responseMessage = resultForLocality.message;
        }
    }

    if( hasAnyValidationFailed ) {
        callback( appConstants.appErrors.validationError, {
            err : true,
            errMsg : responseMessage,
            data : null,
            msg : responseMessage
        });

        return;
    }

    if( !pagingParams.startIndex ){
        pagingParams.startIndex = 0;
    }

    /* Since, we will use getRestaurantList to get approved and unapproved restaurantList,
     * so, this is the best place to modify the query to do so.
     */

    var query = {
        approved : true,
        owner : /[a-zA-Z]{1,}/
    };

    RestaurantDBI.getRestaurantList( searchParams, pagingParams, query, function(err, result ){
        if( err ){
            console.log( 'In AdminRestaurantService ' + err );

            callback( appConstants.appErrors.someError, {
                err : {},
                errMsg : {},
                data : null,
                msg : appConstants.errorMessage.someError
            });
        } else {
            if( null == result || result.result.length === 0 ){
                callback( appConstants.appErrors.noRecordFound, {
                    err : {},
                    errMsg : {},
                    data : null,
                    msg : appConstants.errorMessage.noRecordFound
                });
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

    console.log( 'In AdminRestaurantService | Finished Execution of getApprovedRestaurantList' );
};

/* This method would be used to retrieve unapproved restaurant list. */
var getUnapprovedRestaurantList = function( searchParams, pagingParams, callback ){
    console.log( 'In AdminRestaurantService | Starting Execution of getUnapprovedRestaurantList' );

    /*Starting Validation here.*/
    var name = searchParams.name;
    var locality = searchParams.locality;

    searchParams.cityName = 'lucknow';

    var hasAnyValidationFailed = false;
    var responseMessage  = '';

    var isNameBlank = Validator.isFieldEmpty( name );
    var islocalityBlank = Validator.isFieldEmpty( locality );

    if( isNameBlank ){
        delete searchParams.name;
    } else {

        var resultForName = Validator.isNameNotValid( name );

        if( resultForName.result ){
            hasAnyValidationFailed = true;
            responseMessage = resultForName.message;
        }
    }

    if( islocalityBlank ) {
        delete  searchParams.locality;
    } else {
        var resultForLocality = Validator.isEmailNotValid( locality );

        if( resultForLocality.result ) {
            hasAnyValidationFailed = true;
            responseMessage = resultForLocality.message;
        }
    }

    if( hasAnyValidationFailed ) {
        callback( appConstants.appErrors.validationError, {
            err : true,
            errMsg : responseMessage,
            data : null,
            msg : responseMessage
        });

        return;
    }

    if( !pagingParams.startIndex ){
        pagingParams.startIndex = 0;
    }

    /* Since, we will use getRestaurantList to get approved and unapproved restaurantList,
     * so, this is the best place to modify the query to do so.
     */

    var query = {
        approved : false,
        owner : ''
    };

    RestaurantDBI.getRestaurantList( searchParams, pagingParams, query, function(err, result ){
        if( err ){
            console.log( 'In AdminRestaurantService ' + err );

            callback( appConstants.appErrors.someError, {
                err : {},
                errMsg : {},
                data : null,
                msg : appConstants.errorMessage.someError
            });
        } else {
            if( null == result || result.result.length === 0 ){
                callback( appConstants.appErrors.noRecordFound, {
                    err : {},
                    errMsg : {},
                    data : null,
                    msg : appConstants.errorMessage.noRecordFound
                });
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

    console.log( 'In AdminRestaurantService | Finished Execution of getUnapprovedRestaurantList' );
};

/* This method would be used to create new restaurants.*/
var addNewRestaurant = function( newRestaurant, callback ){
    console.log( 'In AdminRestaurantService | Starting Execution of addNewRestaurant' );

    var hasAnyValidationFailed = false;

    var err = {};
    var errMsg = {};

    if( newRestaurant.stage === 'basicDetails' ){
        var propArray = ['name', 'name | slug', 'name | address.street', 'name | address.locality', 'name | address.town', 'name | address.city', 'number | address.postal_code', ];
        var propArrLen = propArray.length;

        for( var i=0; i<propArrLen; i++){
            var propName = propArray[ i ] ;

            var canBeSplit = propName.split( '| ' ).length > 1;
            var type, propertyStoredIn, propValue='';

            if( canBeSplit ) {
                type = propName.split( '|' )[0].trim();
                propertyStoredIn = propName.split( '|' )[1].trim();

                if( propertyStoredIn.split( '.').length > 1){
                    var splitArray = propertyStoredIn.split( '.' );
                    var splitArrayLength = splitArray.length;

                    var temp = newRestaurant;

                    for( var j=0; j<splitArrayLength; j++){
                        temp = temp[ splitArray[j] ];
                    }

                    propValue = temp;
                } else {
                    propValue = newRestaurant[ propertyStoredIn ];
                }
            } else {
                type = propName;
                propertyStoredIn = propName;

                propValue = newRestaurant[propertyStoredIn];
            }

            var responseFromValidatorForField = Validator.isFieldNotValidByType(propValue, true, type );

            if( responseFromValidatorForField.result ) {
                hasAnyValidationFailed = true;

                setUpError( err, errMsg, propertyStoredIn, responseFromValidatorForField );
            }
        }
    }

    if( hasAnyValidationFailed ){
        callback( appConstants.appErrors.validationError, {
            err : err,
            errMsg : errMsg,
            data : null,
            msg : appConstants.errorMessage.fillDetails
        });
    } else {
        var cityName = 'lucknow';
        RestaurantDBI.addNewRestaurant( cityName, newRestaurant, function( err, result ){
            if( err ){
                console.log( err );
                callback( err, {
                    err : {},
                    errMsg : {},
                    data : null,
                    msg : appConstants.errorMessage.someError
                });
            } else {
                callback( null, {
                    err : {},
                    errMsg : {},
                    data : result,
                    msg :appConstants.successMessage
                });
            }
        });
    }

    console.log( 'In AdminRestaurantService | Finished Execution of addNewRestaurant' );
};

exports.addNewRestaurant = addNewRestaurant;
exports.getApprovedRestaurantList = getApprovedRestaurantList;
exports.getUnapprovedRestaurantList = getUnapprovedRestaurantList;