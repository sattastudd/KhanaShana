/* This Service will handle user related tasks.
 * Like password reset, and password change.
 */

var appConstants = require( '../../../constants/ServerConstants' );
var CustomerAccountDBI = require( '../../../daoLayer/customer/account/CustomerAccountDBI' );

var Validator = require( '../../util/Validator' );

/* This is private utility method to set up error flag and message.
 */
var setUpError = function( err, errMsg, type, response ){
	err[type] = response.result;
	errMsg[type] = response.message;
};

/* This is public method to change Users' Password.*/
var changePassword = function( userInfo, callback ){
	logger.info( 'In CustomerAccountService | Starting execution of changePassword' );
	
	var err = {};
	var errMsg = {};

	var propArray = ['password', 'newPassword'];
	var propArrayLen = propArray.length;

	var hasAnyValidationFailed = false;

	for( var i=0; i<propArrayLen; i++){
		var propName = propArray[ i] ;
		var propValue = userInfo[ propName ];

		var responseForField = Validator.isPasswordNotValid( propValue, true);

		if( responseForField.result ) {
			hasAnyValidationFailed = true;
			err[ propName ] = true;
			errMsg[ propName ] = responseForField.message;
		}
	}

    if( !hasAnyValidationFailed ) {
        if( userInfo.password === userInfo.newPassword ) {
            hasAnyValidationFailed = true;

            err.newPassword = true;
            errMsg.newPassword = appConstants.samePassword;
        }
    }

	if( hasAnyValidationFailed ) {
		callback( appConstants.appErrors.validationError, {
			err : err,
			errMsg : errMsg,
			data : null,
			msg : appConstants.errorMessage.fillDetails
		});
	} else {
		CustomerAccountDBI.changePassword(userInfo, function(err, result){
			if( err ) {
				logger.error( err );
                if( err === appConstants.appErrors.invalidCredentials ) {
                    callback( err, { err : {},
                        errMsg : {},
                        data : null,
                        msg : appConstants.errorMessage.invalidCredentials
                    });
                } else {
                    callback( appConstants.appErrors.internalError, {
                        err : {},
                        errMsg : {},
                        data : null,
                        msg : appConstants.errorMessage.someError
                    });
                }
			} else {
				callback( null, {
					err : {},
					errMsg : {},
					data : result,
					msg : appConstants.passwordChanged
				});
			}
		});
	}

	logger.info( 'In CustomerAccountService | Finished Execution of changePassword' );
};

exports.changePassword = changePassword;