//Models are used for data storage. 
//It is where we will retrieve data from DB.
//In other words, DAOImpl.
var mongoose = require( 'mongoose' );

var bannerDropDownSchema = new mongoose.Schema( {
	menuTitle : String
} );

var connection = null;
var model = null;

var setUpConnection = function(connectionToBeUsed) {

	connection = connectionToBeUsed;

	model = connectionToBeUsed.model( 'bannerDropDownMenu',
			bannerDropDownSchema, 'bannerDropDownMenu' );
};

var getBannerDropDownModel = function() {

	if ( connection !== null && model !== null ) {
		return model;
	} else {
		throw new Error( 'Connection has not been set up yet.' );
	}
};

exports.setUpConnection = setUpConnection;
exports.getBannerDropDownModel = getBannerDropDownModel;