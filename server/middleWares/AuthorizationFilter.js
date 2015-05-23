/* This middleware is responsible for checking if user is authorized to perform the action
 * he/she is going to perform in this request.
 * If yes, call next()
 * Otherwise, send 403.
 */

var authorizeRequest = function ( req, res, next ) {

    if ( utils.isAuthorized( req.originalUrl, req.method.toLowerCase(), req.user.role.toLowerCase() ) ) {
        next();
    } else {
        var msg = 'AuthorizationFilter | Access Denied to ' + ( req.headers[ 'x-forwarded-for' ] || req.connection.remoteAddress ) + ' for ' + req.url + ' with role ' + req.user.role + ' | Sent 403';

        logger.warning( msg );
        res.status( 403 ).json( {
                err : {}, errMsg : {}, data : 'UA', msg : 'UnAuthorized User'
            } );
    }
};

module.exports = authorizeRequest;
