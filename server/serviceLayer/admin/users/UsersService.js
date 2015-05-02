/*In here, we will handle Users Related Information
 */

var appConstants = require( '../../../constants/ServerConstants' );
var UsersDBI = require( '../../../daoLayer/admin/users/UsersDBI' );

var Validator = require( '../../util/Validator' );

var getUserList = function( searchParams, pagingParams, callback ){
    console.log( 'In UsersService | Starting Execution of getUserList' );

    /*Starting Validation here.*/
    var name = searchParams.name;
    var email = searchParams.email;

    var hasAnyValidationFailed = false;
    var responseMessage  = '';

    var isNameBlank = Validator.isFieldEmpty( name );
    var isEmailBlank = Validator.isFieldEmpty( email );

    if( isNameBlank ){
        delete searchParams.name;
    } else {

        var resultForName = Validator.isNameNotValid( name );

        if( resultForName.result ){
            hasAnyValidationFailed = true;
            responseMessage = resultForName.message;
        }
    }

    if( isEmailBlank ) {
        delete  searchParams.email;
    } else {
        var resultForEmail = Validator.isEmailNotValid( email );

        if( resultForEmail.result ) {
            hasAnyValidationFailed = true;
            responseMessage = resultForEmail.message;
        }
    }

    if( hasAnyValidationFailed ) {
        callback( appConstants.appErrors.ValidationError, {
            err : true,
            errMsg : responseMessage,
            data : null,
            msg : responseMessage
        });

        return;
    }

    if( !pagingParams.startIndex ){
        pagingParams.startIndex = 0;
    }

    UsersDBI.getUserList( searchParams, pagingParams, function(err, result ){
        if( err ){
            console.log( 'In UsersService ' + err );

            callback( appConstants.appErrors.someError, {
                err : {},
                errMsg : {},
                data : null,
                msg : appConstants.errorMessage.someError
            });
        } else {
            if( null === result ){
                callback( appConstants.appErrors.noRecordFound, {
                    err : {},
                    errMsg : {},
                    data : null,
                    msg : appConstants.errorMessage.noRecordFound
                });
            } else {
                callback( null, {
                    err : {},
                    errMsg : {},
                    data : result,
                    msg : appConstants.successMessage
                });
            }
        }
    });

    console.log( 'In UsersService | Finished Execution of getUserList' );
};

exports.getUserList = getUserList;
