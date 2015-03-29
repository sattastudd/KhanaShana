/* In here, we will handle Application Stats Retrieval.*/

var StatsDBI = require( '../../../daoLayer/admin/stats/StatsDBI' );
var appConstants = require( '../../../constants/ServerConstants' );

var getAppStats = function( callback ) {
	console.log( 'In StatsService | Starting Execution of getAppStats' );

	StatsDBI.getAppStats( function( err, result ){
		if( err ){
			console.log( 'In StatsService ' + err );
			
			callback( appConstants.appErrors.someError, {
                err : {},
                errMsg : {},
                data : null,
                msg : appConstants.errorMessage.someError
            });
		} else {
            callback( null, {
                err : {},
                errMsg : {},
                data : result,
                msg : appConstants.successMessage
            })
        }
	});

	console.log( 'In StatsService | Finished Execution of getAppStats' );
};

exports.getAppStats = getAppStats;