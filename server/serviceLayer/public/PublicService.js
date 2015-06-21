/* This moudule acts as the service layer.
 * It should perform validations ans send mail.
 */

var publicDBI = require( '../../daoLayer/public/PublicDBI' );

/** Get initial data to be used on the homepage. */
var getGlobalData = function( callback ) {
	logger.info( 'In PublicService | Starting Execution of getGlobalData' );

	/* Perform validations here.
	 */

    var cityName = 'lucknow';
	publicDBI.getGlobalData( cityName, function( err, result ) {
		
		if( err ) {
			logger.error( err );
			callback( err );
		} else {
			callback( null, result );
		}
	} );

	logger.info( 'In PublicService | Finsihed Execution of getGlobalUserData' );
};

/** Public Method to extract all locations from the system. */
var getAllLocations = function( callback ) {

    logger.info( 'In PublicService | Starting Execution of getAllLocations' );

    var cityName = 'lucknow';

    publicDBI.getAllLocations( cityName, function( err, result ) {
        if( err ) {
            logger.error( err );
            callback( err );
        } else {
            callback( null, result );
        }
    });

    logger.info( 'In PublicService | Finished Execution of getAllLocations' );

};

exports.getGlobalData = getGlobalData;
exports.getAllLocations = getAllLocations;