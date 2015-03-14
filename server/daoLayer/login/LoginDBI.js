/* This is DB Interaction file for login related tasks.
 */
var credentials = require( '../../../credentials' );
var appConstants = require( '../../constants/ServerConstants' );

var userModelModule = require( '../../models/login/usersModel' );
var roleModelModule = require( '../../models/login/rolesModel' );

var async = require( 'async' );
var jwt = require( 'jwt-simple' );

/*											Utility Methods											*/
/*==================================================================================================*/
/* Private method to generate token*/
var generateToken = function( user ) {
	return jwt.encode( user, credentials.jwtSecret );
};

/* This method receives an object.
 * 1) Retrives name, email from the object received.
 * 2) Creates the role field in a new object.
 * 3) Creates an expiry date for the token to be generated.
 * 4) Generates the token using above information.
 * 5) Adds this token into token field in the object.
 * 6) Deletes expiry date from the object.
 * 7) Returns object.
 */
var prepareObjectForResponse = function( user, role ) {
	var toReturn = {};

	toReturn.name = user.name;
	toReturn.email = user.email;
	toReturn.role = role;
	toReturn.exp = (new Date()).getTime() + (1000*60*60);
	var token = generateToken( toReturn );

	toReturn.token = token;

	delete toReturn.exp;

	return toReturn;
};

/*											Private Methods											*/
/*==================================================================================================*/

/* Private Method to retrive Role object Id for the desired Role.
 * role = role for which id is to be retrieved.
 * callback = callback for the async module.
 * Part of Sign UP
 */
var retrieveRoleIdForRole = function( role, isUserAlreadyInSystem, callback ) {
	console.log( 'In LoginDBI | Starting Execution of retrieveRoleIdForRole' );

	if( isUserAlreadyInSystem ) {
		callback( appConstants.errorMessage.userExists );
	}
	
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
 * Part of Sign UP
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

/* This method checks if there exists a user with provided email and credential details.
 * Part of Login
 */
var areValidCredentials = function( user, callback ) {

	console.log( 'In LoginDBI | Starting execution of areValidCredentials' );

	var usersDBConnection = utils.getDBConnection( appConstants.appUsersDataBase );

	userModelModule.setUpConnection( usersDBConnection );
	var UserModel = userModelModule.getUsersModel();

	var query = {
		email : user.email,
		credential : user.credential
	};

	var projection = {
		'_id' : false,
		credential : false
	};

	UserModel.findOne( query, projection, function( err, result ) {
		
		if( err ) {
			callback( err, null );
		} else {
			if( null === result ) {
				console.log('LoginDBI | Login Failed for ' + user.email);
				callback( 'No Such Record Exists', null );
			} else {
				callback( null, result );
			}
		}
	} );

	console.log('In LoginDBI | Finished Execution of areValidCredentials' );
};

/* This method retrives the role for the corrosponing role id.
 * Part of Login.
 */
var getRoleForId = function( resultFromLogin, callback ) {

	console.log('In LoginDBI | Starting Execution of getRoleForId' );

	var usersDBConnection = utils.getDBConnection( appConstants.appUsersDataBase );

	roleModelModule.setUpConnection( usersDBConnection );
	var RolesModel = roleModelModule.getRolesModel();

	var ObjectId = roleModelModule.getObjectIdObject();

	var query = { '_id' : new ObjectId( resultFromLogin.role_id ) };
	var projection = { '_id' : false };

	RolesModel.findOne( query, projection, function( err, result ) {

		if( err ) {
			callback( err, null );
		} else {
			if( result === null ) {
				callback( 'No Such Record Exists', null );
			} else {

				callback( null, resultFromLogin, result.name );
			}
		}
	});

	console.log('In LoginDBI | Finished Execution of getRoleForId' );
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

/* This private method would be executed after login is done and user's role has been retrived.
 * We will call callback received from service layer.
 */
var finishLoginProcess = function(callbackFromService, err, user, role ) {
	console.log('In LoginDBI | Starting Execution of finishLoginProcess');

	if( err ) {

		callbackFromService( err );

	} else {


		var toReturn = prepareObjectForResponse( user, role );

		callbackFromService( null, toReturn );
	}

	console.log('In LoginDBI | Finished Execution of finishLoginProcess');
};


/*											Public Methods											*/
/*==================================================================================================*/

/* This is public method, it would be called by service layer.
 */

var signUpUser = function( userInfo, callback ) {
	
	console.log( 'In LoginDBI | Starting Execution of signUpUserDBI' );

	async.waterfall([
		async.apply( isUserAlreadyInSystem, userInfo.email ),
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

/* Public method.
 * It will check if provided credentials are valid.
 */
var loginUser = function( user, callback ) {
	console.log( 'In LoginDBI | Starting Execution of loginUser' );

	async.waterfall([
		async.apply( areValidCredentials, user),
		getRoleForId
	],
	async.apply( finishLoginProcess, callback ));

	console.log( 'In LoginDBI | Finished Execution of loginUser' );
}

/*										Exports In Progress Methods									*/
/*==================================================================================================*/

exports.signUpUser = signUpUser;
exports.isUserAlreadyInSystem = isUserAlreadyInSystem;
exports.loginUser = loginUser;
