/* This controller would facilitate login related functionality like
 * login,
 * forgot password
 * logout
 * userNameCheck
 */

var loginService = require( '../serviceLayer/login/LoginService' );
var appConstants = require( '../constants/ServerConstants' );


/* This method is the landing point of control from the route.
 * It sets up a waterfall call to loginUser first, then, pipes its result to getRoleForId and finally, pipes result
 * to combineAndSend.
 */
var loginUser = function( req, res, next ) {
	
	console.log( 'In LoginController | Starting execution of loginUser' );

	var user = {
		email : req.body.email,
		credential : req.body.credential
	};

	loginService.loginUser( user, function( err, result ){

		if( err ) {
			res.status( 500 )
				.json({
					data : null,
					message : 'Invalid Credentials'
				});
		} else {
			res.status( 200 )
				.json({
					data : result,
					message : 'Login Succcessfull'
				});
		}

	});
	console.log( 'In oginController | Finished execution of loginUser' );
}

/* This method checks if a user already exists with given email id.
 */
var isUserAlreadyInSystem = function( req, res, next ) {

	console.log( 'In LoginController | Starting Execution of isUserAlreadyInSystem ' );

	var email = req.body.email;

	loginService.isUserAlreadyInSystem( email, function( err, result ) {
		if( err ) {
			res.status( 500 )
			   .json({
			   		message : appConstants.errorMessage.someError,
			   		data : false
			   });
		} else {
			res.status( 200 )
				.json({
					message : appConstants.successMessage,
					data : result
				});
		}
	});

	console.log( 'In LoginController | Finished Execution of isUserAlreadyInSystem ');
};

var signUpUser = function( req, res, next ) {

	console.log( 'In LoginController | Starting Execution of signUpUser ' );

	var email = req.body.email;
	var user = {
		name : req.body.name,
		email : req.body.email,
		credential : req.body.credential,
		contact : req.body.contact,
		role : 'User'
	};

	loginService.signUpUser( user, function( err, result ) {
		if( err ) {
			res.status( 500 )
			   .json({
			   		msg : appConstants.errorMessage.someError,
			   		data : null
			   });
		} else {
			res.status( 200 )
				.json({
					msg : appConstants.successMessage,
					data : result
				});
		}
	});

	console.log( 'In LoginController | Finished Execution of signUpUser ');
};

exports.loginUser = loginUser;
exports.signUpUser = signUpUser;
exports.isUserAlreadyInSystem = isUserAlreadyInSystem;