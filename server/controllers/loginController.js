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

var userModelModule = require( '../models/login/usersModel' );
var roleModelModule = require( '../models/login/rolesModel' );

/* Private method to generate token*/
var generateToken = function( user ) {
	return jwt.encode( user, credentials.jwtSecret );
};

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

exports.loginUser = loginUser;
