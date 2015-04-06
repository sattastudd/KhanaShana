/* This module is responsible for checking if token received is valid.
 * If not, module would send reply accordingly.
 */
var jwt = require( 'jwt-simple' );
var credentials = require( './../../credentials' );

var validateToken = function( req, res, next ) {
	
	/* We will receive token in headers in Authorization header.
	 * Token would be fallowed by Bearer and a space.
	 * We would need to strip it.
	 */
	var token = req.headers.authorization;

	if( typeof token === 'undefined' || token === '' ) {
		console.log('Authenticator | No Authentication Token Found for %s at %s requesting %s | Sent 401', req.headers['x-forwarded-for'] || req.connection.remoteAddress, new Date(), req.originalUrl );

		res.status( 401 )
		   .json({
                err : {},
                errMsg : {},
                data : 'TE',
                msg : 'Invalid token'
		});
	} else if ( token.indexOf( 'Bearer ' ) !== 0 ) {
		console.log('Authenticator | Invalid Token Found for %s at %s requesting %s | Sent 401', req.headers['x-forwarded-for'] || req.connection.remoteAddress, new Date(), req.originalUrl );

		res.status( 401 )
		   .json({
                err : {},
                errMsg : {},
                data : 'IE',
                msg : 'Invalid Authentication Token'
		});
	} else {
		
		token = token.substr( 7 );
		
		try{
			var decoded = jwt.decode( token, credentials.jwtSecret );

			if( decoded.exp <= (new Date()).getTime() ){
				res.status( 401 )
				   .json({
                        err : {},
                        errMsg : {},
                        data : 'TE',
                        msg : 'Token Expired',
                        user : decoded.email
				});
			} else {
				req.user = decoded;
				next();
			}
		} catch ( err ) {
			console.log( err );
			console.log('Authenticator | No Authentication Token Found for %s at %s requesting %s | Sent 401', req.headers['x-forwarded-for'] || req.connection.remoteAddress, new Date(), req.originalUrl );

			res.status( 401 )
			   .json({
                    err : {},
                    errMsg : {},
                    data : 'IE',
                    msg : 'Invalid Authentication Token'
			});
		}
	}
};

module.exports = validateToken;