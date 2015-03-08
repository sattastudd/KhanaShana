/* This middleware is responsible for checking if user is authorized to perform the action
 * he/she is going to perform in this request.
 * If yes, call next()
 * Otherwise, send 403.
 */

var authorizeRequest = function( req, res, next ) {
	
	if( utils.isAuthorized( req.url, req.method.toLowerCase(), req.user.role.toLowerCase()) ) {
		next();
	} else {
		console.log('AuthorizationFilter | Access Denied to %s for %s with role %s. | Sent 403', req.headers['x-forwarded-for'] || req.connection.remoteAddress, req.url, req.user.role);
		res.status( 403 )
		   .json({
		   	error : 'UnAuthorized User',
			message : 'UA'
		});
	}
};

module.exports = authorizeRequest;