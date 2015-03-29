/*This Controller file would facilitate retrival of application stats.
 */

 var StatsService = require( '../../../serviceLayer/admin/stats/StatsService' );

 var getStats = function( req, res, next ){
 	console.log( 'In StatsController | Starting Execution of getStats ');

 	StatsService.getAppStats( function ( err, result ){
 		if( err ){
 			res.status( 500 )
 				.json( result );
 		} else {
 			res.status( 200 )
 				.json( result );
 		}
 	});

 	console.log( 'In StatsController | Finished Execution of getStats ');
 };

exports.getStats = getStats;