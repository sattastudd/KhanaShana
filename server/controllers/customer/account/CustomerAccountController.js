/* This controller file would deal with customer user account related tasks.*/

var CustomerAccountService = require( '../../../serviceLayer/customer/account/CustomerAccountService' );
var ServerConstants = require( '../../../constants/ServerConstants' );

var changePassword = function( req, res, next ) {
    logger.info( 'In CustomerAccountController | Starting Execution of changePassword' );

    var userInfo = {
        email : req.user.email,
        password : req.body.password,
        newPassword : req.body.newPassword
    };

    CustomerAccountService.changePassword( userInfo, function( err, result ){
        if( err ) {
            if( err === ServerConstants.appErrors.validationError ) {
                res.status(400)
                    .json(result);
            } else {
                res.status(500)
                    .json(result);
            }
        } else {
            res.status( 200 )
                .json( result );
        }
    });

    logger.info( 'In CustomerAccountController | Finished Execution of changePassword' );
};

exports.changePassword = changePassword;
