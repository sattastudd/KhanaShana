/* This controller file would deal with customer user account related tasks.*/

var CustomerAccountService = require( '../../../serviceLayer/customer/account/CustomerAccountService' );

var changePassword = function( req, res, next ) {
    console.log( 'In CustomerAccountController | Starting Execution of changePassword' );

    var userInfo = {
        email : req.user.email,
        password : req.body.password,
        newPassword : req.body.newPassword
    };

    CustomerAccountService.changePassword( userInfo, function( err, result ){
        if( err ) {
            res.status( 500 )
                .json( result );
        } else {
            res.status( 200 )
                .json( result );
        }
    });

    console.log( 'In CustomerAccountController | Finished Execution of changePassword' );
};

exports.changePassword = changePassword;
