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

exports.getUserList = getUserList;