/* This module is created to restrict hard coding in the application.
 * All the constants like dbNames, should be provided in here.
 */

var appConstants = {
	globalDataBase 		:	'globalDB',
    appUsersDataBase	: 'appUsers',
    
    appErrors : {
        userExists : 'UserExists',
        validationError : 'ValidationError',
        internalError : 'InternalError',
        invalidCredentials : 'InvalidCredentials',
        noRecordFound : 'NoRecordFound'
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
        noRecordFound : 'No Such Record Exists'
	},

    successMessage : 'Ok',
    userCreated : 'User Created Successfully.',
    loginSuccessful : 'Login Successful',
    logoutSuccessful : 'Logout Successful'
};

module.exports = appConstants;
