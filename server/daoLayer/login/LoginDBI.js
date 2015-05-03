/* This is DB Interaction file for login related tasks.
 */
var credentials = require( '../../../credentials' );
var appConstants = require( '../../constants/ServerConstants' );

var userModelModule = require( '../../models/login/usersModel' );
var statsModelModule = require( '../../models/stats/stats' );

var AccountPostResponseTasks = require( '../../daoLayer/postResponseTasks/account/AccountTasks' );

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

    if( isUserAlreadyInSystem ) {
        callback( appConstants.appErrors.userExists );
        return;
    }

	var userDBConnection = utils.getDBConnection( appConstants.appUsersDataBase );

	userModelModule.setUpConnection( userDBConnection );
	var UserModel = userModelModule.getUsersModel();

	var User = new UserModel({
		name : userInfo.name,
		email : userInfo.email.toLowerCase(),
		credential : userInfo.credential,
		contact : userInfo.contact,
		role : userInfo.role,
        	profile_created_date : (new Date()).getTime(),
        	orders : 0,
        	revenueGenerated : 0,
        isBlackListed : false
	});

	User.save( function( err, result ) {
		if( err ) {
			callback( err );
		} else {
			callback( null, stripObjectProperties( result) );

            AccountPostResponseTasks.updateAppStats();
		}
	});
	
	console.log( 'In LoginDBI | Finished Execution of insertUser' );
};

/* Private method to check if credentials provided for admin.
 * Part of admin login.
 */

var areCredentialsValid = function( userInfo, callback ) {
    console.log( 'In LoginDBI | Starting Execution of areCredentialsValid' );

    var usersDBConnection = utils.getDBConnection( appConstants.appUsersDataBase );

    userModelModule.setUpConnection( usersDBConnection );
    var UserModel = userModelModule.getUsersModel();

    var query = {
        email : createCaseInSensitiveRegexString( userInfo.email ),
        credential : userInfo.credential,
        role : userInfo.role,
        isBlackListed : false
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

                if( result.role === 'user' ){
                	callback( appConstants.appErrors.intentionalBreak, result );
                } else {
                	callback( null, prepareObjectForResponse( result ) );
                }
            }
        }
    } );

    console.log( 'In LoginDBI | Finished Execution of areCredentialsValid' );
};

/* Private Method to Retrieve Application Stats
 */
var retrievePostLoginData = function (user, callback ) {
    console.log( 'In LoginDBI | Starting Execution of retrievePostLoginData' );

    var globalDBConnection = utils.getDBConnection( appConstants.globalDataBase );

    statsModelModule.setUpConnection( globalDBConnection );
    var StatsModel = statsModelModule.getModel();

    var query = {};
    var projection = { '_id' : false };

    StatsModel.findOne(query, projection, function( err, result ){
       if( err ){
           callback( err );
       } else {
           var toReturn = {
               user : user,
               stats : result
           };

           callback( null, toReturn );
       }
    });

    console.log( 'In LoginDBI | Finished Execution of retrievePostLoginData' );
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

/* This private method would be executed when admin Login Process is finally completed.
 * We would send response to service layer in this method.
 */
var finshLoginProcess = function( serviceLayerCallback, errFromWaterFellMethod, resultFromWaterFellMethod ){
    console.log( 'In LoginDBI | Starting Execution of finshLoginProcess' );

    if( errFromWaterFellMethod ){

    	if( errFromWaterFellMethod === appConstants.appErrors.intentionalBreak){
    		serviceLayerCallback( null, resultFromWaterFellMethod);
    	} else {
        	serviceLayerCallback( errFromWaterFellMethod );
        }
    } else {
        serviceLayerCallback( null, resultFromWaterFellMethod );
    }

    console.log( 'In LoginDBI | Finishing Execution of finshLoginProcess' );
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
		email : createCaseInSensitiveRegexString(email)
	};

	var projection = {
		'_id' : false
	};

    console.log( query );

	UserModel.findOne( query, projection, function( err, result ) {
        console.log( err );
        console.log( result );
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

var loginUser = function( user, callback ) {
	console.log( 'In LoginDBI | Starting Execution of loginUser' );

	async.waterfall([
		async.apply( areCredentialsValid, user ),
		retrievePostLoginData
	],
		async.apply( finshLoginProcess, callback )
	);
	console.log( 'In LoginDBI | Finished Execution of loginUser' );
};

/*										Exports In Progress Methods									*/
/*==================================================================================================*/

exports.signUpUser = signUpUser;
exports.isUserAlreadyInSystem = isUserAlreadyInSystem;
exports.loginUser = loginUser;