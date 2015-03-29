/*This DBI file is only responsible for retrieving application stats.
 */

var appConstants = require( '../../../constants/ServerConstants' );
var statsModelModule = require( '../../../models/stats/stats' );

var getAppStats = function ( callback ) {
	console.log( 'In StatsDBI | Starting Execution of getAppStats' );

	var globalDBConnection = utils.getDBConnection( appConstants.globalDataBase );

    statsModelModule.setUpConnection( globalDBConnection );
    var StatsModel = statsModelModule.getModel();

    var query = {};
    var projection = { '_id' : false };

    StatsModel.findOne(query, projection, function( err, result ){
       if( err ){
           callback( err );
       } else {           
           callback( null, result );
       }
    });

	console.log( 'In StatsDBI | Finished Execution of getAppStats' );
};

exports.getAppStats = getAppStats;