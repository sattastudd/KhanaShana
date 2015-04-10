/* The major task of a service is to perform validations and send mails.*/

var OptionsDBI = require( '../../../daoLayer/admin/options/OptionsDBI' );
var AppConstants = require( '../../../constants/ServerConstants' );

/* This public method would pass values to the DBI Layer.
 */
var getRestaurantOptions = function( callback ){

    console.log( 'In OptionsService | Starting Execution of getRestaurantOptions' );

    OptionsDBI.getRestaurantOptions( function( err, result ) {
        if( err ) {
            console.log('Error Occurred in OptionsService | In getRestaurantOptions' );
            console.log( err );

            callback( AppConstants.appErrors.someError,
                {
                    err : {},
                    errMsg : {},
                    data : null,
                    msg : AppConstants.errorMessage.someError
                }
            );
        } else {
            callback( null, {
                err : {},
                errMsg : {},
                data : result,
                msg : AppConstants.successMessage
            });
        }
    });

    console.log( 'In OptionsService | Finished Execution of getRestaurantOptions' );

};

exports.getRestaurantOptions = getRestaurantOptions;
