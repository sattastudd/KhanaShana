/* This middleware is responsible for checking if user is authorized to perform the action
 * he/she is going to perform in this request.
 * If yes, call next()
 * Otherwise, send 403.
 */

var authorizeRequest = function( req, res, next ) {

    console.log( req );
	
	if( utils.isAuthorized( req.originalUrl, req.method.toLowerCase(), req.user.role.toLowerCase()) ) {
		next();
	} else {
		console.log('AuthorizationFilter | Access Denied to %s for %s with role %s. | Sent 403', req.headers['x-forwarded-for'] || req.connection.remoteAddress, req.url, req.user.role);
		res.status( 403 )
		   .json({
                err : {},
                errMsg : {},
                data : 'UA',
                msg : 'UnAuthorized User'
		});
	}
};

module.exports = authorizeRequest;
