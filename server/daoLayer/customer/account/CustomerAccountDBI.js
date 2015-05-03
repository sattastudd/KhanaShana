/* This DBI file would handle all Customer User Account Related Tasks. 
 * Like Resetting Password, and change password.
 */

var appConstants = require( '../../../constants/ServerConstants' );
var UserModelModule = require( '../../../models/login/usersModel' );

/* Public method to change users' password.
 */
var changePassword = function( userInfo, callback ) {
	console.log( 'In CustomerAccountDBI | Starting Execution of changePassword' );
	
	var appUsersDBConnection = utils.getDBConnection( appConstants.appUsersDataBase );

	UserModelModule.setUpConnection( getUsersDBConnection );
	var UsersModel = UserModelModule.getUsersModel();

	var query = {
		email : userInfo.email,
		credential : userInfo.password 
	};

	var update = {
		$set : {
			credential : userInfo.newPassword
		}
	};

	UsersModel.update( query, update, function( err, result ) {
		if( err ) {
			callback( err );
		} else {
			callback( null, result );
		}
	});

	console.log( 'In CustomerAccountDBI | Finished Execution of changePassword' );
};

exports.changePassword = changePassword;
