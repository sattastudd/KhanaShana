/* This controller would facilitate retrieval of global data.
 */

 var publicService = require( '../serviceLayer/public/PublicService' );

 var getGlobalDataForCity = function( request, response, next ) {

 		console.log( 'In globalDataController | Starting Execution of getGlobalDataForCity' );

 		var dbName = request.body.cityName;

 		publicService.getGlobalData( dbName, function( err, result ) {

 			if( err ) {
 				console.log( err );
 				response.status( 500 )
 					    .json({
 					    		err : err
 					    });
 			} else {
 				response.status( 200 )
 						.json( result );
 			}
 		});

 		console.log( 'In globalDataController | Finished Execution of getGlobalDataForCity' );
 };

 exports.getGlobalData = getGlobalDataForCity;