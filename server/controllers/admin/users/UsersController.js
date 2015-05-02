/* This controller would interact with Service Layer.*/
var UserService = require( '../../../serviceLayer/admin/users/UsersService' );

var getUserList = function( req, res, next ) {
    console.log( 'In UsersController | Starting Execution of getUserList' );

    var searchParams = {
        name : req.body.name,
        email : req.body.email
    };
    var pagingParams = {
        startIndex : req.body.startIndex
    };

    UserService.getUserList(searchParams, pagingParams, function( err, result ) {
        if( err ) {
            res.status ( 500 )
                .json( result );
        } else {
            res.status( 200 )
                .json( result );
        }
    });


    console.log( 'In UsersController | Finished Execution of getUserList' );
};

var createOrEditUser = function( req, res, next ) {
    console.log( 'In UsersController | Starting Execution of createOrEditUser' );

    var userInfo = {
        name : req.body.name,
        email : req.body.email,
        credential : req.body.credential,
        contact : req.body.contact,
        orders : req.body.orders,
        revenueGenerated : req.body.revenueGenerated
    };

    UserService.createOrEditUser( userInfo, function( err, result ) {
        if( err ) {
            res.status( 500 )
                .json( result );
        } else {
            res.status( 200 ) 
                .json( result );
        }
    });
    console.log( 'In UsersController | Finished Execution of createOrEditUser' );
};

/* Public Controller Method to reset password of a user*/
var resetUserPassword = function( req, res, next ) {
    console.log( 'In UsersController | Starting Execution of resetUserPassword ' );

    var email = req.body.email;

    UserService.resetUserPassword( email, function( err, result ) {
        if( err ) {
            res.status( 500 )
                .json( result );
        } else {
            res.status( 200 )
                .json( result );
        }
    });
    console.log( 'In UsersController | Finsihed Execution of resetUserPassword ' );
}

exports.getUserList = getUserList;
exports.createOrEditUser = createOrEditUser;
exports.resetUserPassword = resetUserPassword;