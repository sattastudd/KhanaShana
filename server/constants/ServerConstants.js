/* This module is created to restrict hard coding in the application.
 * All the constants like dbNames, should be provided in here.
 */

var appConstants = {
    globalDataBase 		:	'globalDB',
    appUsersDataBase	: 'appUsers',
    
    restaurantImagesPath : 'client/images/restaurants/',
    imagePrefixPath : '/images/restaurants/',

    appErrors : {
        userExists : 'UserExists',
        validationError : 'ValidationError',
        internalError : 'InternalError',
        invalidCredentials : 'InvalidCredentials',
        noRecordFound : 'NoRecordFound',
        intentionalBreak: 'IntentionalBreak',
        someError : 'SomeError',
        noMenuPresent : 'No Menu Entries Provided.',
        alreadyHasAnOwner : 'ExistingOwner',
        userAlreadyAssigned : 'ExistingAssignment',
        existingLocation : 'ExistingLocation',
        locationInUse : 'locationInUse',
        deleteFailed : 'deleteFailed'
    },

    errorMessage : {
        someError : 'Some Error Occurred. Please try after some time.',
        userExists: 'User Already Exists.',
        name : 'Invalid Name',
        email : 'Invalid Email',
        mandatory : 'Field can not be left empty.',
        contact : 'Invalid Contact Number.',
        fillDetails : 'Please correct all mistakes before proceeding.',
        invalidCredentials : 'Invalid Credentials',
        noRecordFound : 'No Such Record Exists',
        noSearchCriteria : 'Please enter at least one search criteria.',
        number : 'Invalid Number',
        boolean : 'Invalid value',
        dishType : 'Invalid dish type',
        dropdown : 'Please select a value from dropdown',
        roleError : 'Invalid Role',
        noDeliveryArea : 'Please select a delivery area',
        deliveryAreaInvalid : 'Invalid delivery area name',

        noCuisineSelected : 'Please select a cuisine offered',
        cuisineNameInvalid : 'Invalid delivery area name',

        noMenuPresent : 'Please provide menu details',
        invalidMenu : 'Menu has invalid entry.',

        noItemInCategory : 'Please provide item in category',
        invalidItem : 'Item has invalid details',

        removeError : 'Please remove all errors before proceeding',

        invalidSlug : 'Invalid Restaurant Slug',
        slugInUse : 'Slug field is already used',

        unSupportedFile : 'Unsupported File',

        alreadyHasAnOwner : 'Restaurant Already has an owner.',
        userAlreadyAssigned : 'User already has an assigned restaurant',

        existingLocation : 'Local with name {{1}} Already Exists.',
        locationInUse : 'Location {{1}} is in use. Please remove it from usage before deleting it.',

        deleteFailed : 'Delete Failed',

        oldObjectNull : 'Update query is missing.',
        newObjectNull : 'Values to be updated are missing'
    },

    successMessage : 'Ok',
    userCreated : 'User Created Successfully.',
    loginSuccessful : 'Login Successful',
    logoutSuccessful : 'Logout Successful',
    userBlackListed : 'User BlackListed Successfully.',
    userPermitted : 'User Permitted.',
    userUpdated : 'User Details Updated.',
    passwordReset : 'User Password has been updated successfully.',
    samePassword : 'Please enter a new password.',
    passwordChanged : 'Password has been changed successfully.',

    restaurantDetailsUpdated : 'Restaurant Details have been updated.',

    basicDetailsAdded : 'Basic Restaurant Details have been saved.',

    restaurantApproved : 'Restaurant has been approved.',
    locationDeleted : 'Location {{1}} has been deleted.',
    locationHasBeenUpdated : 'Location {{1}} has been updated.'
};

module.exports = appConstants;