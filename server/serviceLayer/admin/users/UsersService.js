/*In here, we will handle Users Related Information
 */

var appConstants = require( '../../../constants/ServerConstants' );
var UsersDBI = require( '../../../daoLayer/admin/users/UsersDBI' );

var Validator = require( '../../util/Validator' );

/* This is private utility method to set up error flag and error msg in the received maps.
 */
var setUpError = function (err, errMsg, type, response) {
    err[type] = response.result;
    errMsg[type] = response.message;
};

/* This is public utility method to search and retrieve user list from application.*/
var getUserList = function( searchParams, pagingParams, callback ){
    console.log( 'In UsersService | Starting Execution of getUserList' );

    /*Starting Validation here.*/
    var name = searchParams.name;
    var email = searchParams.email;

    var hasAnyValidationFailed = false;
    var responseMessage  = '';

    var isNameBlank = Validator.isFieldEmpty( name );
    var isEmailBlank = Validator.isFieldEmpty( email );

    if( isNameBlank ){
        delete searchParams.name;
    } else {

        var resultForName = Validator.isNameNotValid( name );

        if( resultForName.result ){
            hasAnyValidationFailed = true;
            responseMessage = resultForName.message;
        }
    }

    if( isEmailBlank ) {
        delete  searchParams.email;
    } else {
        var resultForEmail = Validator.isEmailNotValid( email );

        if( resultForEmail.result ) {
            hasAnyValidationFailed = true;
            responseMessage = resultForEmail.message;
        }
    }

    if( hasAnyValidationFailed ) {
        callback( appConstants.appErrors.ValidationError, {
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

    UsersDBI.getUserList( searchParams, pagingParams, function(err, result ){
        if( err ){
            console.log( 'In UsersService ' + err );

            callback( appConstants.appErrors.someError, {
                err : {},
                errMsg : {},
                data : null,
                msg : appConstants.errorMessage.someError
            });
        } else {
            if( null === result ){
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

    console.log( 'In UsersService | Finished Execution of getUserList' );
};

/* Method to create new user / edit existing user.
 * userInfo => Send from LoginController.
 * callback => Callback from LoginController.
 */
var createOrEditUser = function( userInfo, callback ) {
    console.log( 'In UsersService | Starting Execution of createOrEditUser' );

    var isInsert = userInfo.isInsert;

    var err = {};
    var errMsg = {};

    var hasAnyValidationFailed = false;

    if( isInsert ) {

        var propArray = ['name', 'email', 'password | credential', 'contact' ];
        var propArrLen = propArray.length;

        for( var i = 0; i<propArrLen ; i++ ){
            var propName = propArray[ i ] ;

            var canBeSplit = propName.split( '| ' ).length > 1;
            var type, propertyStoredIn;

            if( canBeSplit ) {
                type = propName.split( '|' )[0].trim();
                propertyStoredIn = propName.split( '|' )[1].trim();
            } else {
                type = propName;
                propertyStoredIn = propName;
            }

            var propValue = userInfo[ propertyStoredIn ];

            var responseFromValidatorForField = Validator.isFieldNotValidByType(propValue, true, type );

            if( responseFromValidatorForField.result ) {
                hasAnyValidationFailed = true;

                setUpError( err, errMsg, type, responseFromValidatorForField );
            }
        }

        var responseFromValidatorForRole = Validator.isRoleDropDownNotValid( userInfo.role, true );

        if( responseFromValidatorForRole.result ) {
            hasAnyValidationFailed = true;
            setUpError( err, errMsg, 'role', responseFromValidatorForRole );
        }

        if( hasAnyValidationFailed ) {
            callback( appConstants.appErrors.ValidationError, {
                err : err,
                errMsg : errMsg,
                data : null, 
                msg : ServerConstants.errorMessage.fillDetails
            });
        } else {
            UsersDBI( userInfo, true, function( err, result ) {
                if( err ) {
                    console.log( err );
                    callback( appConstants.appErrors.someError, {
                        err : {},
                        errMsg : {},
                        data : null,
                        msg : ServerConstants.errorMessage.someError
                    });
                } else {
                    callback( null, {
                        err : {},
                        errMsg : {},
                        data : result,
                        msg : ServerConstants.successMessage
                    });
                }
            });
        }
    } else {
        var propArray = ['name', 'email', 'orders', 'number | revenueGenerated', 'contact' ];
        var propArrLen = propArray.length;

        for( var i = 0; i<propArrLen ; i++ ){
            var propName = propArray[ i ] ;

            var canBeSplit = propName.split( '| ' ).length > 1;
            var type, propertyStoredIn;

            if( canBeSplit ) {
                type = propName.split( '|' )[0].trim();
                propertyStoredIn = propName.split( '|' )[1].trim();
            } else {
                type = propName;
                propertyStoredIn = propName;
            }

            var propValue = userInfo[ propertyStoredIn ];

            var responseFromValidatorForField = Validator.isFieldNotValidByType(propValue, true, type );

            if( responseFromValidatorForField.result ) {
                hasAnyValidationFailed = true;

                setUpError( err, errMsg, type, responseFromValidatorForField );
            }
        }

        var responseFromValidatorForRole = Validator.isRoleDropDownNotValid( userInfo.role, true );

        if( responseFromValidatorForRole.result ) {
            hasAnyValidationFailed = true;
            setUpError( err, errMsg, 'role', responseFromValidatorForRole );
        }

        if( hasAnyValidationFailed ) {
            callback( appConstants.appErrors.ValidationError, {
                err : err,
                errMsg : errMsg,
                data : null, 
                msg : ServerConstants.errorMessage.fillDetails
            });
        } else {
            UsersDBI( userInfo, false, function( err, result ) {
                if( err ) {
                    console.log( err );
                    callback( appConstants.appErrors.someError, {
                        err : {},
                        errMsg : {},
                        data : null,
                        msg : ServerConstants.errorMessage.someError
                    });
                } else {
                    callback( null, {
                        err : {},
                        errMsg : {},
                        data : result,
                        msg : ServerConstants.successMessage
                    });
                }
            });
        }

    }

    console.log( 'In UsersService | Finished Execution of createOrEditUser' );
};

/* Public Method to Reset a Users' Password */
var resetUserPassword = function( userEmail, callback ) {
    console.log( 'In UsersService | Starting Execution of resetUserPassword' );

    var err = {};
    var errMsg = {};

    var responseFromValidatorForEmail = Validator.isEmailNotValid( userEmail, true );

    if( responseFromValidatorForEmail.result ) {
        err.email = true;
        errMsg.email = responseFromValidatorForEmail.message;

        callback( appConstants.appErrors.ValidationError, {
            err : err,
            errMsg : errMsg,
            data : null,
            msg :  appConstants.errorMessage.email
        } );
    } else {
        UsersDBI.resetUserPassword( userEmail, function( err, result ) {
            if( err ) {
                console.log( err );
                callback( appConstants.appErrors.someError, {
                    err : {},
                    errMsg : {},
                    data : null,
                    msg : appConstants.errorMessage.someError
                } );
            } else {
                callback( null, {
                    err : {},
                    errMsg : {},
                    data : result,
                    msg : appConstants.successMessage
                });
            }
        });
    }

    console.log( 'In UsersService | Finished Execution of resetUserPassword' );
};

exports.getUserList = getUserList;
exports.createOrEditUser = createOrEditUser;
exports.resetUserPassword = resetUserPassword;