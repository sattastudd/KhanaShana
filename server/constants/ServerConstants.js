/* This module is created to restrict hard coding in the application.
 * All the constants like dbNames, should be provided in here.
 */

var appConstants = {
	globalDataBase 		:	'globalDB',
	appUsersDataBase	:	'appUsers',

	errorMessage : {
		someError : 'Some Error Occurred. Please try after some time.'
	},

	successMessage : 'Ok'
};

module.exports = appConstants;