/* This controller would facilitate retrieval of data like cuisines and locations.
 */
var OptionsService = require( '../../../serviceLayer/admin/options/OptionsService' );

/* This public method for call service layer. 
 * Controllers are only responsible for extracting avalues, and sending response.
 */

var getRestaurantOptions = function( req, res, next ){

	console.log( 'In OptionsController | Starting Execution of getRestaurantOptions' );

    OptionsService.getRestaurantOptions( function(err, result ){
        if( err ){
            res.status( 500 )
                .json( result );
        } else {
            res.status( 200 )
                .json( result );
        }
    });

	console.log( 'In OptionsController | Finsihed Execution of getRestaurantOptions' );

};

exports.getRestaurantOptions = getRestaurantOptions;
