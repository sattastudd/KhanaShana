/* This module acts as the service layer.
 * All the validations and mail service should be performed in here.
 */
var ServerConstants = require( '../../constants/ServerConstants' );
var RestaurantPublicDBI = require('../../daoLayer/public/PublicRestaurantDBI' );

var getRestaurantInfoBySlug = function ( cityName, slug, callback ) {
    console.log( 'In RestaurantPublicService | Starting Execution of getRestaurantInfoBySlug' );

    /*Perform Validations here*/
    RestaurantPublicDBI.getRestaurrantInfoBySlug( cityName, slug, function( err, result ){
       if( err ){
           console.log( err );

           if( err === ServerConstants.appErrors.noRecordFound ) {

               callback( ServerConstants.appErrors.noRecordFound, {
                   err : {},
                   errMap : {},
                   data : null,
                   msg : ServerConstants.errorMessage.noRecordFound
               });
           } else {
               callback( ServerConstants.appErrors.someError, {
                   err : {},
                   errMap : {},
                   data : null,
                   msg : ServerConstants.errorMessage.someError
               });
           }
       } else {
           callback(null, {
               err : {},
               errMap :  {},
               data : result,
               msg : ServerConstants.successMessage
           });
       }
    });
    console.log( 'In RestaurantPublicService | Finished Execution of getRestaurantInfoBySlug' );
};

exports.getRestaurantInfoBySlug = getRestaurantInfoBySlug;