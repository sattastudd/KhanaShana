/* This controller would facilitate login related functionality like
 * login,
 * forgot password
 * logout
 * userNameCheck
 */

var BlueDart = require( '../dataTraveller/BlueDart' );

var async = require( 'async' );
var jwt = require( 'jwt-simple' );

var credentials = require( '../../credentials' );
var appConstants = require( '../constants/ServerConstants' );

var userModelModule = require( '../models/login/usersModel' );
var roleModelModule = require( '../models/login/rolesModel' );

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

/* This method checks if there exists a user with provided email and credential details.
 */
var areValidCredentials = function( email, credential, callback ) {

	console.log( 'In LoginController | Starting execution of areValidCredentials' );

	var usersDBConnection = utils.getDBConnection( 'appUsers' );

	userModelModule.setUpConnection( usersDBConnection );
	var UserModel = userModelModule.getUsersModel();

	var query = {
		email : email,
		credential : credential
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
				console.log('LoginController | Login Failed for ' + email);
				callback( 'No Such Record Exists', null );
			} else {
				callback( null, result );
			}
		}
	} );

	console.log('In LoginController | Exiting areValidCredentials' );
};

/* This method retrives the role for the corrosponing role id.
 */
var getRoleForId = function( user, callback ) {

	console.log('In LoginController | Starting Execution of getRoleForId' );

	var usersDBConnection = utils.getDBConnection( 'appUsers' );

	roleModelModule.setUpConnection( usersDBConnection );
	var RolesModel = roleModelModule.getRolesModel();

	var ObjectId = roleModelModule.getObjectIdObject();

	var query = { '_id' : new ObjectId( user.role_id ) };
	var projection = { '_id' : false };

	RolesModel.findOne( query, projection, function( err, result ) {

		if( err ) {
			callback( err, null );
		} else {
			if( result === null ) {
				callback( 'No Such Record Exists', null );
			} else {

				callback( null, user, result.name );
			}
		}
	});
	console.log('In LoginController | Finnished Execution of getRoleForId' );
};

/* Combines and sends the result to the client.
 */
var combineAndSendLoginResult = function(response, err, user, role ) {
	console.log('In LoginController | Starting Execution of combineAndSendLoginResult');

	var blueDart = new BlueDart();

	if( err ) {
		blueDart.setStatus( 401 );
		blueDart.setMessage( 'Invalid Credentials' );
		blueDart.setData({
			message : 'Invalid Credentials'
		});

		response.status( 401 );

	} else {
		var toReturn = prepareObjectForResponse( user, role );
		
		blueDart.setStatus( 200 );
		blueDart.setMessage( 'OK' );
		blueDart.setData( toReturn );

		response.status( 200 );
	}

	response.send( blueDart );

	console.log('In LoginController | Finished Execution of combineAndLoginResult');
};

/* This method is the landing point of control from the route.
 * It sets up a waterfall call to loginUser first, then, pipes its result to getRoleForId and finally, pipes result
 * to combineAndSend.
 */
var loginUser = function( req, res, next ) {
	
	console.log( 'In LoginController | Starting execution of loginUser' );

	var email = req.body.email;
	var credential = req.body.credential;
	
	async.waterfall([
		async.apply( areValidCredentials, email, credential),
		getRoleForId
	],
	async.apply( combineAndSendLoginResult, res ));

	console.log( 'In oginController | Finished execution of loginUser' );
}

/* This method checks if a user already exists with given email id.
 */
var isEmailAlreadyUsed = function( req, res, next ) {
	
	console.log('In LoginController | Starting Execution of isEmailAlreadyUsed' );

	var usersDBConnection = utils.getDBConnection( appConstants.appUsersDataBase );

	userModelModule.setUpConnection( usersDBConnection );
	var UserModel = userModelModule.getUsersModel();

	var email = req.body.email;

	var query = {
		email : email 
	};

	var projection = {
		'_id' : false,
		credential : false
	};
	
	var blueDart = new BlueDart();

	UserModel.findOne( query, projection, function( err, result ) {
		if( err ) {
			console.log( err );
			
			blueDart.setStatus( 500 );
			blueDart.setMessage( 'An error has ocurred' );
			blueDart.setData( null );

			res.status( 500 );
		} else {
			if( result !== null ) {
				blueDart.setStatus( 500 );
				blueDart.setMessage( 'Ok' );
				blueDart.setData( true );

				res.status( 200 );
			} else {
				blueDart.setStatus( 200 );
				blueDart.setMessage( 'Ok' );
				blueDart.setData( false );

				res.status( 200 );
			}
		}

		res.send( blueDart );
	});

	console.log( 'In LoginController | Finished Execution of isEmailAlreadyUsed');
};

exports.loginUser = loginUser;
exports.isEmailAlreadyUsed = isEmailAlreadyUsed;