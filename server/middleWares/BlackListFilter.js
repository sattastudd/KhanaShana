/* This module simple checks if the token passed is blackListed or not.
 * If it is,
 * 401 status is send for re-login.
 * Other wise calls up for next middleware in queue
 */
var BlackListFilter = function( req, res, next ) {
	var token = req.headers.Authorization;

	token = token.substr( 7 );

	if( utils.isBlackListedToken( token ) ) {
		console.log('BlackListFilter | BlackListed Token Found for %s at %s requesting %s | Sent 401', req.headers['x-forwarded-for'] || req.connection.remoteAddress, new Date(), req.originalUrl );

		res.status( 401 )
		   .json({
		   	error : 'Session Expired',
			message : 'SE'
		});
	} else {
		next();
	}
};

module.exports = BlackListFilter;
