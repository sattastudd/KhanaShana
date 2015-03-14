/* This moudle would act as Validtor Service.
 * Developer is responsible to make sure that method are named in such a way that following conditions are met.
 * True => Validation Failed.
 * False => Validation Passed.
 * Methods would return an object like.
 * {
 *      result : result,
 *      message : errorMessage 
 * }
 */

var RegExProvider = require( '../../constants/RegExProvider' );
var ServerConstants = require('../../constants/ServerConstants');

var mandatoryMessage = ServerConstants.errorMessage.mandatory;

var isFieldNotValid = function (value, isMandatory, mandatoryMessage, regEx, inValidMessage){

    if (isMandatory && (value === '' || null == value)) {
        return {
            result : true,
            message : mandatoryMessage
        };
    } else if (value === '' || value == null) {
        return {
            result : false
        };
    }
    
    if (!regEx) {
        return {
            result : false
        };
    }

    var result = !regEx.test(value);

    if (result) {
        return {
            result : result,
            message : inValidMessage
        };
    } else {
        return {
            result : result
        };
    }
}

var isNameNotValid = function (name, isMandatory) {
    return isFieldNotValid(name, isMandatory, mandatoryMessage, RegExProvider.name, ServerConstants.errorMessage.name);
};

var isEmailNotValid = function (email, isMandatory) {
    return isFieldNotValid(email, isMandatory, mandatoryMessage, RegExProvider.email, ServerConstants.errorMessage.email);
};

var isPasswordNotValid = function (credential, isMandatory) {
    return isFieldNotValid(credential, isMandatory, mandatoryMessage);
};

var isContactNotValid = function (contact, isMandatory) {
    return isFieldNotValid(contact, isMandatory, mandatoryMessage, RegExProvider.contactNumber, ServerConstants.errorMessage.contact);
}

exports.isNameNotValid = isNameNotValid;
exports.isEmailNotValid = isEmailNotValid;
exports.isPasswordNotValid = isPasswordNotValid;
exports.isContactNotValid = isContactNotValid;