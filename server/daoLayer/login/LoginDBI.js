/* This is DB Interaction file for login related tasks.
 */
var appConstants = require( '../../constants/ServerConstants' );

var userModelModule = require( '../../models/login/usersModel' );
var roleModelModule = require( '../../models/login/rolesModel' );

var async = require( 'async' );

/*											Utility Methods											*/
/*==================================================================================================*/

/*											Private Methods											*/
/*==================================================================================================*/

/* Private Method to retrive Role object Id for the desired Role.
 * role = role for which id is to be retrieved.
 * callback = callback for the async module.
 */
var retrieveRoleIdForRole = function( role, callback ) {
	console.log( 'In LoginDBI | Starting Execution of retrieveRoleIdForRole' );

	var userDBConnection = utils.getDBConnection( appConstants.appUsersDataBase );

	roleModelModule.setUpConnection( userDBConnection );
	var RolesModel = roleModelModule.getRolesModel();

	var query = {
		name : role
	};

	console.log( role );

	RolesModel.findOne( query, function( err, role ) {
		if( err ) {
			console.log( err );
			callback( err );
		} else {
			console.log( role );
			callback( null, role );
		}
	});

	console.log( 'In LoginDBI | Finished Execution of retrieveRoleIdForRole' );
};

/* Private method to insert info into DB.
 */
var insertUser = function( userInfo, role, callback ) {
	console.log( 'In LoginDBI | Starting Execution of insertUser' );

	var userDBConnection = utils.getDBConnection( appConstants.appUsersDataBase );

	userModelModule.setUpConnection( userDBConnection );
	var UserModel = userModelModule.getUsersModel();

	var User = new UserModel({
		name : userInfo.name,
		email : userInfo.email,
		credential : userInfo.credential,
		contact : userInfo.contact,
		role_id : role._id
	});

	User.save( function( err, result ) {
		if( err ) {
			console.log( err );
			callback( err );
		} else {
			console.log( result );
			callback( null, result );
		}
	});
	
	console.log( 'In LoginDBI | Finished Execution of insertUser' );
};

/*										Final Callback Methods											*/
/*==================================================================================================*/

/* This private method would be executed when Sign Up Process is finally completed.
 * Due to conditions, we would return back to service layer in this method only.
 */
var finishSignUpProcess = function( serviceLayerCallBack, errorFromWaterFalledMethod, resultFromWaterFalledMethod ) {
	
	console.log( 'In LoginDBI | Starting Execution of finishSignUpProcess' );

	if( errorFromWaterFalledMethod ) {
		console.log( errorFromWaterFalledMethod );
		serviceLayerCallBack( errorFromWaterFalledMethod );
	} else {
		console.log( resultFromWaterFalledMethod );
		serviceLayerCallBack( null, resultFromWaterFalledMethod );
	}

	console.log( 'In LoginDBI | Finishing Execution of finishSignUpProcess' );
};


/*											Public Methods											*/
/*==================================================================================================*/

/* This is public method, it would be called by service layer.
 */

var signUpUser = function( userInfo, callback ) {
	
	console.log( 'In LoginDBI | Starting Execution of signUpUserDBI' );

	async.waterfall([
		async.apply( retrieveRoleIdForRole, 'User' ),
		async.apply( insertUser, userInfo)
		], 

		async.apply( finishSignUpProcess, callback )
	);
	console.log( 'In LoginDBI | Finished Execution of signUpUserDBI' );
};

/* Public Method.
 * It will check for presence of email id in the collection.
 * This method can also be used as the utility if no callback is passed.
 */
var isUserAlreadyInSystem = function( email, callback ) {

	console.log( 'In LoginDBI | Starting Execution of isUserAlreadyInSystem' );

	var isBeingUsedAsUtility = false;

	if( null === callback ) {
		isBeingUsedAsUtility = true;
	}

	var userDBConnection = utils.getDBConnection( appConstants.appUsersDataBase );
	userModelModule.setUpConnection( userDBConnection );

	var UserModel = userModelModule.getUsersModel();

	var query = {
		email : email
	};

	var projection = {
		'_id' : false
	};

	UserModel.findOne( query, projection, function( err, result ) {
		if( err ) {
			if( isBeingUsedAsUtility ){
				return {msg : err};
			} else {
				callback( err );
			}
		} else {
			if( result !== null ) {
				if( isBeingUsedAsUtility ) {
					return true;
				} else {
					callback( null, true)
				}
			} else {
				if ( isBeingUsedAsUtility ) {
					return false;
				} else {
					callback( null, false);
				}
			}
		}
	});

	console.log( 'In LoginDBI | Finished Execution of isUserAlreadyInSystem' );
};

/*										Exports In Progress Methods									*/
/*==================================================================================================*/

exports.signUpUser = signUpUser;
exports.isUserAlreadyInSystem = isUserAlreadyInSystem;