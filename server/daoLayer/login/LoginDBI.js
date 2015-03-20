/* This is DB Interaction file for login related tasks.
 */
var credentials = require( '../../../credentials' );
var appConstants = require( '../../constants/ServerConstants' );

var userModelModule = require( '../../models/login/usersModel' );

var async = require( 'async' );
var jwt = require( 'jwt-simple' );

/*											Utility Methods											*/
/*==================================================================================================*/
/* Private method to generate token*/
var generateToken = function( user ) {
	return jwt.encode( user, credentials.jwtSecret );
};

/* This method receives an object.
 * 1) Retrieves name, email from the object received.
 * 2) Creates the role field in a new object.
 * 3) Creates an expiry date for the token to be generated.
 * 4) Generates the token using above information.
 * 5) Adds this token into token field in the object.
 * 6) Deletes expiry date from the object.
 * 7) Returns object.
 */
var prepareObjectForResponse = function( user ) {
	var toReturn = {};

    toReturn.email = user.email;
    toReturn.exp = (new Date()).getTime() + (1000*60*60);
    toReturn.role = user.role;

    var token = generateToken( toReturn );

    delete toReturn.role;
    delete toReturn.exp;

    toReturn.name = user.name;
    toReturn.token = token;

	return toReturn;
};

/* Private method to generate case insensitive Regex.
 */
var createCaseInSensitiveRegexString = function( value ) {
    return new RegExp( '^' + value + '$', 'i');
};

/* Private method to strip properties unnecessary properties like id and details.
 */
var stripObjectProperties = function (newUser) {
    var toReturn = {};

    toReturn.name = newUser.name;
    toReturn.email = newUser.email;

    return toReturn;
};

/*											Private Methods											*/
/*==================================================================================================*/

/* Private method to insert info into DB.
 * Part of Sign UP
 */
var insertUser = function( userInfo, isUserAlreadyInSystem, callback ) {
	console.log( 'In LoginDBI | Starting Execution of insertUser' );

	var userDBConnection = utils.getDBConnection( appConstants.appUsersDataBase );

	userModelModule.setUpConnection( userDBConnection );
	var UserModel = userModelModule.getUsersModel();

	var User = new UserModel({
		name : userInfo.name,
		email : userInfo.email.toLowerCase(),
		credential : userInfo.credential,
		contact : userInfo.contact,
		role : 'user',
        profile_created_date : (new Date()).getTime()
	});

	User.save( function( err, result ) {
		if( err ) {
			callback( err );
		} else {
			callback( null, stripObjectProperties( result) );
		}
	});
	
	console.log( 'In LoginDBI | Finished Execution of insertUser' );
};
/*										Final Callback Methods											*/
/*==================================================================================================*/

/* This private method would be executed when Sign Up Process is finally completed.
 * Due to conditions, we would return back to service layer in this method only.
 */
var finishSignUpProcess = function( serviceLayerCallBack, errorFromWaterFallenMethod, resultFromWaterFallenMethod ) {

	console.log( 'In LoginDBI | Starting Execution of finishSignUpProcess' );

	if( errorFromWaterFallenMethod ) {
		serviceLayerCallBack( errorFromWaterFallenMethod );
	} else {
		serviceLayerCallBack( null, resultFromWaterFallenMethod );
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
		async.apply( isUserAlreadyInSystem, userInfo.email ),
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
		email : createCaseInSensitiveRegexString(email),
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

    var usersDBConnection = utils.getDBConnection( appConstants.appUsersDataBase );

    userModelModule.setUpConnection( usersDBConnection );
    var UserModel = userModelModule.getUsersModel();

    var query = {
        email : createCaseInSensitiveRegexString( user.email ),
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
                callback( appConstants.appErrors.invalidCredentials, null );
            } else {
                console.log( result );
                callback( null, prepareObjectForResponse( result ) );
            }
        }
    } );

	console.log( 'In LoginDBI | Finished Execution of loginUser' );
};

/*										Exports In Progress Methods									*/
/*==================================================================================================*/

exports.signUpUser = signUpUser;
exports.isUserAlreadyInSystem = isUserAlreadyInSystem;
exports.loginUser = loginUser;
