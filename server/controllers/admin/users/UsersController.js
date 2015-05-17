/* This controller would interact with Service Layer.*/
var UserService = require( '../../../serviceLayer/admin/users/UsersService' );

var getUserList = function( req, res, next ) {
    console.log( 'In UsersController | Starting Execution of getUserList' );

    var searchParams = {
        name : req.body.name,
        email : req.body.email,
        role : req.body.role,
        isAssigned : req.body.isAssigned
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
        revenueGenerated : req.body.revenueGenerated,
        isInsert : req.body.isInsert,
        role : req.body.role,
        oldEmail : req.body.oldEmail
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

    console.log( email );

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
};

/* Public Controller Method to blacklist a user.*/
var blackListUser = function( req, res, next ) {
    console.log('In UsersController | Starting Execution of blackListUser' );

    var email = req.body.email;
    var toBlackList = req.body.toBlackList;

    UserService.blackListUser(email, toBlackList, function( err, result ) {
        if( err ) {
            res.status( 500 ) 
                .json( result );
        } else {
            res.status( 200 )
                .json( result );
        }
    });
    console.log('In UsersController | Finished Execution of blackListUser' );
}

exports.getUserList = getUserList;
exports.createOrEditUser = createOrEditUser;
exports.resetUserPassword = resetUserPassword;
exports.blackListUser = blackListUser;