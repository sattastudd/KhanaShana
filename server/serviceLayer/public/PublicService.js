/* This moudule acts as the service layer.
 * It should perform validations ans send mail.
 */

var publicDBI = require( '../../daoLayer/public/PublicDBI' );

var getGlobalData = function( dbName, callback ) {
	console.log( 'In PublicService | Starting Execution of getGlobalData' );

	/* Perform validations here.
	 */

	publicDBI.getGlobalData( dbName, function( err, result ) {
		
		if( err ) {
			console.log( err );
			callback( err );
		} else {
			callback( null, result );
		}
	} );

	console.log( 'In PublicService | Finsihed Execution of getGlobalUserData' );
};

exports.getGlobalData = getGlobalData;
