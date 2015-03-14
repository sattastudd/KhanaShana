/* This module acts as the service layer.
 * It should perform validations and send mail.
 * 
 * For validtor,
 * true => Validation Failed.
 * false => Validation Passed.
 * 
 * For all results, service should response like this.
 * {
 *      data : data_recieved_from_login.
 *      err  :  {
 *          name : false
 *      },
 *      errMsg : {
 *          name : 'InValid Name'
 *      }
 * }
 * 
 * In case of validation error,
 * data => null.
 * err => Error Map for those fields for whom validation failed.
 * errMsg => Error Message Map for those fields for whom validation failed.
 * 
 * In case of db err.
 * Log err.
 * Send someError.
 * 
 * In case of success.
 * data => data from db.
 * error = {};
 * errMsg = {};
 * 
 * But is should be present.
 */

var Validator = require('../util/Validator');

var ServerConstants = require('../../constants/ServerConstants');

var loginDBI = require('../../daoLayer/login/LoginDBI');

var setUpError = function (err, errMsg, type, response) {
    err[type] = response.result;
    errMsg[type] = response.message;
};

var loginUser = function( user, callback ) {
	console.log( 'In LoginService | Starting Execution of loginUser' );

	/*Perform validtions here.
	 */
	loginDBI.loginUser( user, function( err, result ) {

		if( err ) {
			console.log( err );
			callback( err );
		} else {
			callback( null, result );
		}
	});

	console.log( 'In LoginService | Finished Execution of loginUser' );
}

var signUpUser = function( userInfo, callback ) {

    console.log('In LoginService | Starting Execution of signUpUSer');
    
    var err = {};
    var errMsg = {};
    
    var hasAnyValidationFailed = false;

    /*Starting Validations*/
    var responseFromValidatorForName = Validator.isNameNotValid(userInfo.name, true);
    var responseFromValidatorForEmail = Validator.isEmailNotValid(userInfo.email, true);
    var responseFromValidatorForPassword = Validator.isPasswordNotValid(userInfo.credential, true);
    var responseFromValidatorForContact = Validator.isContactNotValid(userInfo.contact, true);
    
    if (responseFromValidatorForName.result) {
        hasAnyValidationFailed = true;
        
        setUpError(err, errMsg, 'name', responseFromValidatorForName);
    }
    
    if (responseFromValidatorForEmail.result) {
        hasAnyValidationFailed = true;
        
        setUpError(err, errMsg, 'email', responseFromValidatorForEmail);
    }
    
    if (responseFromValidatorForPassword.result) {
        hasAnyValidationFailed = true;

        setUpError(err, errMsg, 'password', responseFromValidatorForPassword);
    }
    
    if (responseFromValidatorForContact.result) {
        hasAnyValidationFailed = true;

        setUpError(err, errMsg, 'contact', responseFromValidatorForContact);
    }
    
    if (hasAnyValidationFailed) {
        console.log('Validation Error for SignUp | Sent ValidationError');
        callback('ValidationError', {
            err : err,
            errMsg : errMsg,
            data : null,
            msg : 'Please correct all mistakes before proceeding.'
        });

        return;
    }
    /*Finished Validations*/

	loginDBI.signUpUser( userInfo, function( err, result ) {
		
		if( err ) {
            if (err === ServerConstants.appErrors.userExists) {
                callback(ServerConstants.appErrors.userExists, {
                    err : {},
                    errMsg : {},
                    data : null,
                    msg : ServerConstants.errorMessage.userExists
                });
            }
		} else {
            callback(null, {
                data : result,
                msg : ServerConstants.userCreated
            });
		}
	});

	console.log( 'In LoginService | Finished Execution of signUpUser' );
};

var isUserAlreadyInSystem = function( email, callback ) {
	console.log('In LoginService | Starting Execution of isUserAlreadyInSystem' );

	/*Peform Validations here.
	 */
	loginDBI.isUserAlreadyInSystem( email, function( err, result ) {

		if( err ) {
			callback( err );
		} else {
			callback( null, result );
		}
	});
	console.log('In LoginService  | Finished Execution of isUserAlreadyInSystem' );
};

exports.loginUser = loginUser;
exports.signUpUser = signUpUser;
exports.isUserAlreadyInSystem = isUserAlreadyInSystem;