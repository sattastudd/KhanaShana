/* This module would act as Validtor Service.
 * Developer is responsible to make sure that method are named in such a way that following conditions are met.
 * True => Validation Failed.
 * False => Validation Passed.
 * Methods would return an object like.
 * {
 *      result : result,
 *      message : errorMessage 
 * }
 */

var ServerConstants = require('../../constants/ServerConstants');

var mandatoryMessage = ServerConstants.errorMessage.mandatory;

var RegExProvider = {
    name: /^[a-zA-Z ]{1,}$/,
    email: /^[_A-Za-z0-9-\+]+(\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\.[A-Za-z0-9]+)*(\.[A-Za-z]{2,})$/,
    contactNumber : /^[1-9][0-9]{9,10}$/,
    number : /^[0-9]{1,}$/,
    slug : /^[a-zA-Z-]+$/,
    fileName : /^[a-zA-Z0-9-]+.[jpg,jpeg,png,JPG,JPEG,PNG]+$/,
    boolean : /^[true,false]{1,}$/,
    dishType : /^[Half,Full]{1,}$/
};

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
};

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
};

var isSlugNotValid = function( value, isMandatory ) {
    return isFieldNotValid( value, isMandatory, mandatoryMessage, RegExProvider.slug, ServerConstants.errorMessage.invalidSlug );
};

var isReceivedFieldNotValid = function( fieldValue, isMandatory ) {
    return isFieldNotValid( fieldValue, isMandatory, mandatoryMessage );
};

var isNumberNotValid = function( number, isMandatory ) {
    return isFieldNotValid( number, isMandatory, mandatoryMessage, RegExProvider.number, ServerConstants.errorMessage.number );
};

var isBooleanNotValid = function( value, isMandatory ) {
    return isFieldNotValid( value, isMandatory, mandatoryMessage, RegExProvider.boolean, ServerConstants.errorMessage.boolean );
};

var isDishTypeNotValid = function( value, isMandatory ) {
    return isFieldNotValid( value, isMandatory, mandatoryMessage, RegExProvider.dishType, ServerConstants.errorMessage.dishType );
}

var isFileNameNotValid = function (value) {
    var result = !RegExProvider.fileName.test(value);
    
    if (result) {
        return {
            result : result,
            message : ServerConstants.errorMessage.unSupportedFile
        }
    } else {
        return {
            result : result
        }
    }
};

var isEverythingAllowed = function( value ) {
    return { result : false }
};

var isFieldNotValidByType = function( fieldValue, isMandatory, type ) {
    if( type === 'name' ) {
        return isNameNotValid( fieldValue, isMandatory );
    } else if( type === 'email' ) {
        return isEmailNotValid( fieldValue, isMandatory );
    } else if( type === 'contact' ) {
        return isContactNotValid( fieldValue, isMandatory );
    } else if( type === 'number' ) {
        return isNumberNotValid( fieldValue, isMandatory );
    } else if( type === 'password' ) {
        return isPasswordNotValid( fieldValue, isMandatory );
    }

    return null;
};

var isRoleDropDownNotValid = function( receivedValue, isMandatory ) {
    if (isMandatory && (receivedValue === '' || null == receivedValue)) {
        return {
            result : true,
            message : mandatoryMessage
        };
    } else if (receivedValue === '' || receivedValue == null) {
        return {
            result : false
        };
    }

    var possibleRoles = ['user', 'restOwn'];
    var matchFound = false;

    for( var i=0; i<possibleRoles.length; i++){
        if( receivedValue === possibleRoles[i]){
            matchFound = true;
            break;
        }
    }

    if( matchFound ) {
        return {
            result : false
        };
    } else {
        return {
            result : true,
            message : ServerConstants.errorMessage.roleError
        }
    }
};

var isFieldEmpty = function( fieldValue ){
    if( fieldValue === '' || fieldValue == null || typeof fieldValue === 'undefined' ){
        return true;
    }
    return false;
};

exports.isFieldEmpty = isFieldEmpty;
exports.isNameNotValid = isNameNotValid;

exports.isEmailNotValid = isEmailNotValid;
exports.isPasswordNotValid = isPasswordNotValid;

exports.isSlugNotValid = isSlugNotValid;
exports.isNumberNotValid = isNumberNotValid;

exports.isContactNotValid = isContactNotValid;
exports.isReceivedFieldNotValid = isReceivedFieldNotValid;

exports.isFieldNotValidByType = isFieldNotValidByType;
exports.isRoleDropDownNotValid = isRoleDropDownNotValid;

exports.isFileNameNotValid = isFileNameNotValid;
exports.isBooleanNotValid = isBooleanNotValid;

exports.isDishTypeNotValid = isDishTypeNotValid;

exports.isEverythingAllowed = isEverythingAllowed;