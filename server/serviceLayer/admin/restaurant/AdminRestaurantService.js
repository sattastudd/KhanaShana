/*In here, we will handle Users Related Information
 */

var appConstants = require( '../../../constants/ServerConstants' );
var RestaurantDBI = require( '../../../daoLayer/admin/restaurant/AdminRestaurantDBI' );

var Validator = require( '../../util/Validator' );

/* This is public utility method to search and retrieve user list from application.*/
var getRestaurantList = function( searchParams, pagingParams, callback ){
    console.log( 'In UsersService | Starting Execution of getRestaurantList' );

    /*Starting Validation here.*/
    var name = searchParams.name;
    var locality = searchParams.locality;

    searchParams.cityName = 'lucknow';

    var hasAnyValidationFailed = false;
    var responseMessage  = '';

    var isNameBlank = Validator.isFieldEmpty( name );
    var islocalityBlank = Validator.isFieldEmpty( locality );

    if( isNameBlank ){
        delete searchParams.name;
    } else {

        var resultForName = Validator.isNameNotValid( name );

        if( resultForName.result ){
            hasAnyValidationFailed = true;
            responseMessage = resultForName.message;
        }
    }

    if( islocalityBlank ) {
        delete  searchParams.locality;
    } else {
        var resultForLocality = Validator.isEmailNotValid( locality );

        if( resultForLocality.result ) {
            hasAnyValidationFailed = true;
            responseMessage = resultForLocality.message;
        }
    }

    if( hasAnyValidationFailed ) {
        callback( appConstants.appErrors.validationError, {
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

    RestaurantDBI.getRestaurantList( searchParams, pagingParams, function(err, result ){
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

    console.log( 'In UsersService | Finished Execution of getRestaurantList' );
};

exports.getRestaurantList = getRestaurantList;